"""
Stockage des images : Cloudinary (prod) ou dossier local uploads/ (dev)
"""

import logging
import os
import re
import uuid
from typing import Optional
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

UPLOAD_DIR = "uploads"
_CLOUD_NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{2,}$", re.I)


class StorageError(Exception):
    """Erreur de stockage (Cloudinary requis en production)."""


def _clean_env(key: str) -> Optional[str]:
    val = os.getenv(key)
    if not val:
        return None
    return val.strip().strip('"').strip("'")


def is_production_hosting() -> bool:
    if os.getenv("RENDER"):
        return True
    db_url = os.getenv("DATABASE_URL", "")
    return db_url.startswith("postgresql")


def _cloudinary_credentials() -> Optional[dict]:
    """Retourne les credentials Cloudinary nettoyés, ou None."""
    url = _clean_env("CLOUDINARY_URL")
    if url:
        if not url.startswith("cloudinary://"):
            return {"error": "CLOUDINARY_URL doit commencer par cloudinary://"}
        # cloudinary://api_key:api_secret@cloud_name
        try:
            parsed = urlparse(url)
            cloud_name = parsed.hostname or parsed.path.lstrip("/")
            if not cloud_name:
                return {"error": "CLOUDINARY_URL invalide : cloud name manquant après @"}
            return {
                "cloud_name": cloud_name,
                "api_key": parsed.username,
                "api_secret": parsed.password,
                "from_url": True,
            }
        except Exception:
            return {"error": "CLOUDINARY_URL mal formée. Format : cloudinary://API_KEY:API_SECRET@CLOUD_NAME"}

    cloud_name = _clean_env("CLOUDINARY_CLOUD_NAME")
    api_key = _clean_env("CLOUDINARY_API_KEY")
    api_secret = _clean_env("CLOUDINARY_API_SECRET")

    if cloud_name and api_key and api_secret:
        return {
            "cloud_name": cloud_name,
            "api_key": api_key,
            "api_secret": api_secret,
            "from_url": False,
        }
    return None


def cloudinary_configured() -> bool:
    creds = _cloudinary_credentials()
    return creds is not None and "error" not in creds


def _validate_cloud_name(cloud_name: str) -> Optional[str]:
    if not cloud_name:
        return "CLOUDINARY_CLOUD_NAME est vide."
    if " " in cloud_name:
        return f"CLOUDINARY_CLOUD_NAME contient des espaces : « {cloud_name} »"
    if cloud_name.startswith("http"):
        return "CLOUDINARY_CLOUD_NAME ne doit pas être une URL — utilisez uniquement le cloud name (ex. dxyz123abc)."
    if cloud_name.isdigit() and len(cloud_name) > 10:
        return (
            "CLOUDINARY_CLOUD_NAME ressemble à une API Key. "
            "Le cloud name est affiché en haut du Dashboard Cloudinary (ex. dxyz123abc)."
        )
    if not _CLOUD_NAME_RE.match(cloud_name):
        return f"CLOUDINARY_CLOUD_NAME invalide : « {cloud_name} »"
    return None


def _configure_cloudinary():
    import cloudinary

    creds = _cloudinary_credentials()
    if not creds or "error" in creds:
        raise StorageError(creds.get("error", "Cloudinary non configuré") if creds else "Cloudinary non configuré")

    cloud_name = creds["cloud_name"]
    name_err = _validate_cloud_name(cloud_name)
    if name_err:
        raise StorageError(name_err)

    url = _clean_env("CLOUDINARY_URL")
    if url and creds.get("from_url"):
        cloudinary.config(cloudinary_url=url, secure=True)
    else:
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=creds["api_key"],
            api_secret=creds["api_secret"],
            secure=True,
        )


def _friendly_cloudinary_error(exc: Exception) -> str:
    msg = str(exc)
    if "404" in msg or "Page not found" in msg:
        cloud = _clean_env("CLOUDINARY_CLOUD_NAME") or "(via CLOUDINARY_URL)"
        return (
            f"Compte Cloudinary introuvable pour le cloud name « {cloud} ». "
            "Dans Render, vérifiez CLOUDINARY_CLOUD_NAME : c'est la valeur « Cloud name » "
            "du Dashboard Cloudinary (Product environment credentials), pas l'API Key."
        )
    if "401" in msg or "Unauthorized" in msg or "Invalid Signature" in msg:
        return (
            "Clé API ou secret Cloudinary incorrect. "
            "Recopiez API Key et API Secret depuis Cloudinary → Dashboard → API Keys."
        )
    if "html" in msg.lower() or len(msg) > 300:
        return (
            "Erreur de connexion à Cloudinary. Vérifiez CLOUDINARY_CLOUD_NAME, "
            "CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET sur Render."
        )
    return msg


def verify_cloudinary() -> dict:
    """Teste la connexion Cloudinary (ping API)."""
    if not cloudinary_configured():
        return {"ok": False, "error": "Cloudinary non configuré"}

    creds = _cloudinary_credentials()
    if creds and "error" in creds:
        return {"ok": False, "error": creds["error"]}

    cloud_name = creds["cloud_name"] if creds else ""
    name_err = _validate_cloud_name(cloud_name)
    if name_err:
        return {"ok": False, "error": name_err, "cloud_name": cloud_name}

    try:
        _configure_cloudinary()
        import cloudinary.api

        cloudinary.api.ping()
        return {"ok": True, "cloud_name": cloud_name}
    except Exception as exc:
        return {"ok": False, "error": _friendly_cloudinary_error(exc), "cloud_name": cloud_name}


def storage_status() -> dict:
    creds = _cloudinary_credentials()
    mode = "cloudinary" if cloudinary_configured() else "local"
    warning = None
    cloudinary_check = None

    if creds and "error" in creds:
        warning = creds["error"]
    elif is_production_hosting() and not cloudinary_configured():
        warning = (
            "Cloudinary non configuré : les images seront perdues à chaque redeploy. "
            "Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET sur Render."
        )
    elif cloudinary_configured():
        cloudinary_check = verify_cloudinary()
        if not cloudinary_check.get("ok"):
            warning = cloudinary_check.get("error")

    return {
        "mode": mode,
        "production": is_production_hosting(),
        "warning": warning,
        "cloudinary": cloudinary_check,
    }


def _public_id_from_url(url: str) -> Optional[str]:
    match = re.search(r"/upload/(?:v\d+/)?(.+)\.[a-zA-Z0-9]+$", url)
    return match.group(1) if match else None


def _save_local(content: bytes, ext: str) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(content)
    return unique_filename


async def save_upload(file, folder: str = "gicos") -> str:
    content = await file.read()
    original = file.filename or "image.jpg"
    ext = os.path.splitext(original)[1] or ".jpg"

    if cloudinary_configured():
        try:
            _configure_cloudinary()
            import cloudinary.uploader

            result = cloudinary.uploader.upload(
                content,
                folder=folder,
                resource_type="image",
                public_id=str(uuid.uuid4()),
            )
            return result["secure_url"]
        except StorageError:
            raise
        except Exception as exc:
            logger.error("Cloudinary upload failed: %s", exc)
            if is_production_hosting():
                raise StorageError(_friendly_cloudinary_error(exc)) from exc

    if is_production_hosting():
        raise StorageError(
            "Cloudinary obligatoire en production. "
            "Configurez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET sur Render."
        )

    return _save_local(content, ext)


def delete_media(stored: Optional[str]) -> None:
    if not stored:
        return

    if stored.startswith("http://") or stored.startswith("https://"):
        if not cloudinary_configured():
            return
        _configure_cloudinary()
        import cloudinary.uploader

        public_id = _public_id_from_url(stored)
        if public_id:
            try:
                cloudinary.uploader.destroy(public_id)
            except Exception:
                pass
        return

    file_path = os.path.join(UPLOAD_DIR, stored)
    if os.path.exists(file_path):
        os.remove(file_path)


def media_path_for_db(stored: str) -> str:
    if stored.startswith("http://") or stored.startswith("https://"):
        return stored
    return f"/uploads/{stored}"
