"""
Router pour les messages de contact
GICOS - Galaxie Immobilière Construction et Services
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import get_db
from models import ContactMessage, User
from schemas import ContactCreate, ContactResponse
from auth import get_current_admin_user

router = APIRouter(prefix="/api/contact", tags=["Contact"])


@router.post("/", response_model=ContactResponse)
async def create_contact_message(
    contact_data: ContactCreate,
    db: Session = Depends(get_db)
):
    """
    Envoie un message de contact.
    Accessible publiquement.
    """
    new_message = ContactMessage(**contact_data.model_dump())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return new_message


@router.get("/", response_model=List[ContactResponse])
async def get_contact_messages(
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Récupère la liste des messages de contact.
    Réservé aux administrateurs.
    """
    query = db.query(ContactMessage)
    
    if unread_only:
        query = query.filter(ContactMessage.is_read == False)
    
    messages = query.order_by(desc(ContactMessage.created_at)).offset(skip).limit(limit).all()
    return messages


@router.get("/count")
async def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Compte le nombre de messages non lus."""
    count = db.query(ContactMessage).filter(ContactMessage.is_read == False).count()
    return {"unread_count": count}


@router.get("/{message_id}", response_model=ContactResponse)
async def get_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Récupère un message de contact spécifique."""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message non trouvé"
        )
    
    return message


@router.put("/{message_id}/read")
async def mark_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Marque un message comme lu."""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message non trouvé"
        )
    
    message.is_read = True
    db.commit()
    
    return {"message": "Message marqué comme lu"}


@router.put("/read-all")
async def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Marque tous les messages comme lus."""
    db.query(ContactMessage).filter(
        ContactMessage.is_read == False
    ).update({"is_read": True})
    db.commit()
    
    return {"message": "Tous les messages ont été marqués comme lus"}


@router.delete("/{message_id}")
async def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Supprime un message de contact."""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message non trouvé"
        )
    
    db.delete(message)
    db.commit()
    
    return {"message": "Message supprimé avec succès"}
