"""
Router pour la gestion des services
GICOS - Galaxie Immobilière Construction et Services
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Service, User
from schemas import ServiceCreate, ServiceUpdate, ServiceResponse
from auth import get_current_admin_user

router = APIRouter(prefix="/api/services", tags=["Services"])


@router.get("/", response_model=List[ServiceResponse])
async def get_services(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    Récupère la liste des services.
    """
    query = db.query(Service)
    
    if active_only:
        query = query.filter(Service.is_active == True)
    
    services = query.order_by(Service.order_index).all()
    return services


@router.get("/{slug}", response_model=ServiceResponse)
async def get_service_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """Récupère un service par son slug."""
    service = db.query(Service).filter(Service.slug == slug).first()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service non trouvé"
        )
    
    return service


@router.post("/", response_model=ServiceResponse)
async def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Crée un nouveau service."""
    # Vérifier si le slug existe déjà
    existing = db.query(Service).filter(Service.slug == service_data.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un service avec ce slug existe déjà"
        )
    
    new_service = Service(**service_data.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    
    return new_service


@router.put("/reorder")
async def reorder_services(
    order: List[dict],  # [{"id": 1, "order_index": 0}, ...]
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Réorganise l'ordre des services."""
    for item in order:
        service = db.query(Service).filter(Service.id == item["id"]).first()
        if service:
            service.order_index = item["order_index"]

    db.commit()

    return {"message": "Ordre des services mis à jour"}


@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Met à jour un service existant."""
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service non trouvé"
        )

    update_data = service_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(service, key, value)

    db.commit()
    db.refresh(service)

    return service


@router.delete("/{service_id}")
async def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Supprime un service."""
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service non trouvé"
        )

    db.delete(service)
    db.commit()

    return {"message": "Service supprimé avec succès"}
