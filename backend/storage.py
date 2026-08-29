"""
Stockage des images : Cloudinary (prod) ou dossier local uploads/ (dev)
"""

import os
import re
import uuid
from typing import Optional

UPLOAD_DIR = "uploads"


def cloudinary_configured() -> bool:
    if os.getenv("CLOUDINARY_URL"):
        return True
    return bool(
        os.getenv("CLOUDINARY_CLOUD_NAME")
        and os.getenv("CLOUDINARY_API_KEY")
        and os.getenv("CLOUDINARY_API_SECRET")
    )


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
    """Extrait le public_id d'une URL Cloudinary."""
    match = re.search(r"/upload/(?:v\d+/)?(.+)\.[a-zA-Z0-9]+$", url)
    return match.group(1) if match else None


async def save_upload(file, folder: str = "gicos") -> str:
    """
    Sauvegarde un UploadFile.
    Retourne l'URL Cloudinary (prod) ou le nom de fichier local (dev).
    """
    content = await file.read()
    original = file.filename or "image.jpg"
    ext = os.path.splitext(original)[1] or ".jpg"

    if cloudinary_configured():
        _configure_cloudinary()
        import cloudinary.uploader

        result = cloudinary.uploader.upload(
            content,
            folder=folder,
            resource_type="image",
            public_id=str(uuid.uuid4()),
        )
        return result["secure_url"]

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(content)
    return unique_filename


def delete_media(stored: Optional[str]) -> None:
    """Supprime un média (URL Cloudinary ou fichier local)."""
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
    """Valeur filepath pour la galerie."""
    if stored.startswith("http://") or stored.startswith("https://"):
        return stored
    return f"/uploads/{stored}"
