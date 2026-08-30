"""
Stockage des images : Cloudinary (prod) ou dossier local uploads/ (dev)
"""

import logging
import os
import re
import uuid
from typing import Optional

logger = logging.getLogger(__name__)

UPLOAD_DIR = "uploads"


class StorageError(Exception):
    """Erreur de stockage (Cloudinary requis en production)."""


def is_production_hosting() -> bool:
    """Render définit RENDER=true ; Neon/Postgres indique aussi la prod."""
    if os.getenv("RENDER"):
        return True
    db_url = os.getenv("DATABASE_URL", "")
    return db_url.startswith("postgresql")


def cloudinary_configured() -> bool:
    if os.getenv("CLOUDINARY_URL"):
        return True
    return bool(
        os.getenv("CLOUDINARY_CLOUD_NAME")
        and os.getenv("CLOUDINARY_API_KEY")
        and os.getenv("CLOUDINARY_API_SECRET")
    )


def storage_status() -> dict:
    mode = "cloudinary" if cloudinary_configured() else "local"
    warning = None
    if is_production_hosting() and not cloudinary_configured():
        warning = (
            "Cloudinary non configuré : les images seront perdues à chaque redeploy. "
            "Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET sur Render."
        )
    return {"mode": mode, "production": is_production_hosting(), "warning": warning}


def _configure_cloudinary():
    import cloudinary

    url = os.getenv("CLOUDINARY_URL")
    if url:
        cloudinary.config(cloudinary_url=url)
    else:
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET"),
            secure=True,
        )


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
    """
    Sauvegarde un UploadFile.
    Retourne l'URL Cloudinary (prod) ou le nom de fichier local (dev).
    """
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
        except Exception as exc:
            logger.error("Cloudinary upload failed: %s", exc)
            if is_production_hosting():
                raise StorageError(
                    f"Échec Cloudinary : {exc}. Vérifiez vos clés API Cloudinary sur Render."
                ) from exc

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
