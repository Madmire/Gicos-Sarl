"""
Router pour les témoignages clients
GICOS - Galaxie Immobilière Construction et Services
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import get_db
from models import Testimonial, User
from schemas import TestimonialCreate, TestimonialResponse, TestimonialSubmit
from auth import get_current_admin_user

router = APIRouter(prefix="/api/testimonials", tags=["Témoignages"])


@router.get("/", response_model=List[TestimonialResponse])
async def get_testimonials(
    active_only: bool = True,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Récupère la liste des témoignages.
    """
    query = db.query(Testimonial)
    
    if active_only:
        query = query.filter(Testimonial.is_active == True)
    
    testimonials = query.order_by(desc(Testimonial.created_at)).limit(limit).all()
    return testimonials


@router.get("/{testimonial_id}", response_model=TestimonialResponse)
async def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db)
):
    """Récupère un témoignage spécifique."""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Témoignage non trouvé"
        )
    
    return testimonial


@router.post("/submit", response_model=TestimonialResponse)
async def submit_testimonial(
    testimonial_data: TestimonialSubmit,
    db: Session = Depends(get_db),
):
    """
    Soumission publique d'un témoignage.
    Le témoignage reste inactif jusqu'à validation par l'administrateur.
    """
    new_testimonial = Testimonial(
        **testimonial_data.model_dump(),
        is_active=False,
    )
    db.add(new_testimonial)
    db.commit()
    db.refresh(new_testimonial)

    return new_testimonial


@router.post("/", response_model=TestimonialResponse)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Crée un nouveau témoignage."""
    new_testimonial = Testimonial(**testimonial_data.model_dump())
    db.add(new_testimonial)
    db.commit()
    db.refresh(new_testimonial)
    
    return new_testimonial


@router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: int,
    testimonial_data: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Met à jour un témoignage existant."""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Témoignage non trouvé"
        )
    
    update_data = testimonial_data.model_dump()
    for key, value in update_data.items():
        setattr(testimonial, key, value)
    
    db.commit()
    db.refresh(testimonial)
    
    return testimonial


@router.delete("/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Supprime un témoignage."""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Témoignage non trouvé"
        )
    
    db.delete(testimonial)
    db.commit()
    
    return {"message": "Témoignage supprimé avec succès"}
