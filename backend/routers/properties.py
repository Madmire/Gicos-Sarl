"""
Router pour la gestion des annonces immobilières
GICOS - Galaxie Immobilière Construction et Services
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import get_db
from models import Property, PropertyImage, User
from schemas import (
    PropertyCreate,
    PropertyUpdate,
    PropertyResponse,
    PropertyListResponse,
    PropertyImageResponse
)
from auth import get_current_admin_user
from storage import save_upload, delete_media

router = APIRouter(prefix="/api/properties", tags=["Annonces"])


def get_primary_image(property_obj: Property) -> Optional[str]:
    """Récupère l'image principale d'une annonce"""
    primary = next((img for img in property_obj.images if img.is_primary), None)
    if primary:
        return primary.filename
    if property_obj.images:
        return property_obj.images[0].filename
    return None


@router.get("/", response_model=List[PropertyListResponse])
async def get_properties(
    skip: int = 0,
    limit: int = 12,
    property_type: Optional[str] = None,
    city: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_surface: Optional[float] = None,
    max_surface: Optional[float] = None,
    rooms: Optional[int] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Récupère la liste des annonces avec filtres optionnels.
    """
    query = db.query(Property)
    
    # Appliquer les filtres
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if category:
        query = query.filter(Property.category == category)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if min_surface is not None:
        query = query.filter(Property.surface >= min_surface)
    if max_surface is not None:
        query = query.filter(Property.surface <= max_surface)
    if rooms is not None:
        query = query.filter(Property.rooms >= rooms)
    if featured is not None:
        query = query.filter(Property.featured == featured)
    if search:
        query = query.filter(
            (Property.title.ilike(f"%{search}%")) |
            (Property.description.ilike(f"%{search}%")) |
            (Property.city.ilike(f"%{search}%"))
        )
    
    # Trier par date de création (plus récent en premier)
    query = query.order_by(desc(Property.created_at))
    
    # Pagination
    properties = query.offset(skip).limit(limit).all()
    
    # Formater la réponse
    result = []
    for prop in properties:
        result.append(PropertyListResponse(
            id=prop.id,
            title=prop.title,
            price=prop.price,
            city=prop.city,
            property_type=prop.property_type,
            category=prop.category,
            surface=prop.surface,
            rooms=prop.rooms,
            bedrooms=prop.bedrooms,
            bathrooms=prop.bathrooms,
            primary_image=get_primary_image(prop),
            created_at=prop.created_at
        ))
    
    return result


@router.get("/count")
async def get_properties_count(
    property_type: Optional[str] = None,
    city: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Compte le nombre total d'annonces avec filtres."""
    query = db.query(Property)
    
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if category:
        query = query.filter(Property.category == category)
    
    return {"count": query.count()}


@router.get("/featured", response_model=List[PropertyListResponse])
async def get_featured_properties(
    limit: int = 6,
    db: Session = Depends(get_db)
):
    """Récupère les annonces mises en avant."""
    properties = db.query(Property).filter(
        Property.featured == True
    ).order_by(desc(Property.created_at)).limit(limit).all()
    
    result = []
    for prop in properties:
        result.append(PropertyListResponse(
            id=prop.id,
            title=prop.title,
            price=prop.price,
            city=prop.city,
            property_type=prop.property_type,
            category=prop.category,
            surface=prop.surface,
            rooms=prop.rooms,
            bedrooms=prop.bedrooms,
            bathrooms=prop.bathrooms,
            primary_image=get_primary_image(prop),
            created_at=prop.created_at
        ))
    
    return result


@router.get("/recent", response_model=List[PropertyListResponse])
async def get_recent_properties(
    limit: int = 6,
    db: Session = Depends(get_db)
):
    """Récupère les annonces les plus récentes."""
    properties = db.query(Property).order_by(
        desc(Property.created_at)
    ).limit(limit).all()
    
    result = []
    for prop in properties:
        result.append(PropertyListResponse(
            id=prop.id,
            title=prop.title,
            price=prop.price,
            city=prop.city,
            property_type=prop.property_type,
            category=prop.category,
            surface=prop.surface,
            rooms=prop.rooms,
            bedrooms=prop.bedrooms,
            bathrooms=prop.bathrooms,
            primary_image=get_primary_image(prop),
            created_at=prop.created_at
        ))
    
    return result


@router.get("/cities")
async def get_cities(db: Session = Depends(get_db)):
    """Récupère la liste des villes disponibles."""
    cities = db.query(Property.city).distinct().all()
    return [city[0] for city in cities if city[0]]


@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    """Récupère la liste des catégories disponibles."""
    categories = db.query(Property.category).distinct().all()
    return [cat[0] for cat in categories if cat[0]]


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'une annonce."""
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annonce non trouvée"
        )
    
    return property_obj


@router.post("/", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Crée une nouvelle annonce."""
    new_property = Property(**property_data.model_dump())
    db.add(new_property)
    db.commit()
    db.refresh(new_property)
    
    return new_property


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Met à jour une annonce existante."""
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annonce non trouvée"
        )
    
    update_data = property_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(property_obj, key, value)
    
    db.commit()
    db.refresh(property_obj)
    
    return property_obj


@router.delete("/{property_id}")
async def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Supprime une annonce et ses images associées."""
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annonce non trouvée"
        )
    
    # Supprimer les fichiers images
    for image in property_obj.images:
        delete_media(image.filename)
    
    db.delete(property_obj)
    db.commit()
    
    return {"message": "Annonce supprimée avec succès"}


@router.post("/{property_id}/images")
async def upload_property_images(
    property_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Upload des images pour une annonce."""
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annonce non trouvée"
        )
    
    uploaded_images = []
    is_first = len(property_obj.images) == 0
    
    for file in files:
        stored = await save_upload(file, folder="gicos/properties")
        
        image = PropertyImage(
            filename=stored,
            property_id=property_id,
            is_primary=is_first
        )
        db.add(image)
        uploaded_images.append(stored)
        is_first = False
    
    db.commit()
    
    return {"message": f"{len(uploaded_images)} image(s) uploadée(s)", "images": uploaded_images}


@router.delete("/{property_id}/images/{image_id}")
async def delete_property_image(
    property_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Supprime une image d'une annonce."""
    image = db.query(PropertyImage).filter(
        PropertyImage.id == image_id,
        PropertyImage.property_id == property_id
    ).first()
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image non trouvée"
        )
    
    delete_media(image.filename)
    
    db.delete(image)
    db.commit()
    
    return {"message": "Image supprimée avec succès"}


@router.put("/{property_id}/images/{image_id}/primary")
async def set_primary_image(
    property_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Définit une image comme image principale."""
    # Retirer le statut primary de toutes les images de l'annonce
    db.query(PropertyImage).filter(
        PropertyImage.property_id == property_id
    ).update({"is_primary": False})
    
    # Définir la nouvelle image principale
    image = db.query(PropertyImage).filter(
        PropertyImage.id == image_id,
        PropertyImage.property_id == property_id
    ).first()
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image non trouvée"
        )
    
    image.is_primary = True
    db.commit()
    
    return {"message": "Image principale mise à jour"}
