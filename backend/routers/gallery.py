"""
Router pour la gestion de la galerie
GICOS - Galaxie Immobilière Construction et Services
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Body
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import get_db
from models import Gallery, User
from schemas import GalleryResponse
from auth import get_current_admin_user
from storage import save_upload, delete_media, media_path_for_db

router = APIRouter(prefix="/api/gallery", tags=["Galerie"])

# Types d'images valides pour la galerie
VALID_IMAGE_TYPES = [
    "immobilier",
    "construction",
    "electricite",
    "carrelage",
    "plomberie",
    "peinture",
    "sonorisation"
]

# Labels français pour les types
IMAGE_TYPE_LABELS = {
    "immobilier": "Immobilier",
    "construction": "Construction",
    "electricite": "Électricité",
    "carrelage": "Carrelage",
    "plomberie": "Plomberie",
    "peinture": "Peinture / Staff",
    "sonorisation": "Sonorisation"
}


@router.get("/", response_model=List[GalleryResponse])
async def get_gallery_images(
    image_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Récupère les images de la galerie avec filtre optionnel par type.
    """
    query = db.query(Gallery)
    
    if image_type and image_type in VALID_IMAGE_TYPES:
        query = query.filter(Gallery.image_type == image_type)
    
    images = query.order_by(desc(Gallery.created_at)).offset(skip).limit(limit).all()
    return images


@router.get("/types")
async def get_image_types():
    """Récupère la liste des types d'images disponibles."""
    return [
        {"value": key, "label": label}
        for key, label in IMAGE_TYPE_LABELS.items()
    ]


@router.get("/count")
async def get_gallery_count(
    image_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Compte le nombre d'images dans la galerie."""
    query = db.query(Gallery)
    
    if image_type and image_type in VALID_IMAGE_TYPES:
        query = query.filter(Gallery.image_type == image_type)
    
    return {"count": query.count()}


@router.get("/{image_id}", response_model=GalleryResponse)
async def get_gallery_image(
    image_id: int,
    db: Session = Depends(get_db)
):
    """Récupère une image spécifique de la galerie."""
    image = db.query(Gallery).filter(Gallery.id == image_id).first()
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image non trouvée"
        )
    
    return image


@router.post("/upload")
async def upload_gallery_images(
    files: List[UploadFile] = File(...),
    image_type: str = Form(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Upload multiple d'images pour la galerie.
    """
    # Valider le type d'image
    if image_type not in VALID_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Type d'image invalide. Types valides: {', '.join(VALID_IMAGE_TYPES)}"
        )
    
    # Créer le dossier uploads si nécessaire (mode local uniquement)
    uploaded_images = []
    
    for file in files:
        # Vérifier que c'est une image
        if not file.content_type or not file.content_type.startswith("image/"):
            continue
        
        stored = await save_upload(file, folder="gicos/gallery")
        
        gallery_image = Gallery(
            filename=stored,
            filepath=media_path_for_db(stored),
            image_type=image_type,
            title=title,
            description=description
        )
        db.add(gallery_image)
        uploaded_images.append(stored)
    
    db.commit()
    
    return {
        "message": f"{len(uploaded_images)} image(s) uploadée(s)",
        "images": uploaded_images
    }


@router.put("/{image_id}")
async def update_gallery_image(
    image_id: int,
    image_type: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Met à jour les informations d'une image de la galerie."""
    image = db.query(Gallery).filter(Gallery.id == image_id).first()
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image non trouvée"
        )
    
    if image_type:
        if image_type not in VALID_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Type d'image invalide"
            )
        image.image_type = image_type
    
    if title is not None:
        image.title = title
    if description is not None:
        image.description = description
    
    db.commit()
    
    return {"message": "Image mise à jour avec succès"}


@router.delete("/{image_id}")
async def delete_gallery_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Supprime une image de la galerie."""
    image = db.query(Gallery).filter(Gallery.id == image_id).first()
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image non trouvée"
        )
    
    # Supprimer le fichier
    delete_media(image.filename)
    
    db.delete(image)
    db.commit()
    
    return {"message": "Image supprimée avec succès"}


@router.delete("/")
async def delete_multiple_gallery_images(
    image_ids: List[int] = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Supprime plusieurs images de la galerie."""
    deleted_count = 0
    
    for image_id in image_ids:
        image = db.query(Gallery).filter(Gallery.id == image_id).first()
        if image:
            delete_media(image.filename)
            
            db.delete(image)
            deleted_count += 1
    
    db.commit()
    
    return {"message": f"{deleted_count} image(s) supprimée(s)"}
