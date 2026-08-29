"""
Modèles SQLAlchemy pour la base de données
GICOS - Galaxie Immobilière Construction et Services
"""

from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """Modèle pour les utilisateurs administrateurs"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Property(Base):
    """Modèle pour les annonces immobilières"""
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    city = Column(String(100), nullable=False)
    property_type = Column(String(20), nullable=False)  # vente / location
    category = Column(String(50), nullable=True)  # appartement, maison, terrain, etc.
    surface = Column(Float, nullable=True)
    rooms = Column(Integer, nullable=True)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    living_rooms = Column(Integer, nullable=True)
    kitchens = Column(Integer, nullable=True)
    garage = Column(Boolean, default=False)
    garden = Column(Boolean, default=False)
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relation avec les images
    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan")


class PropertyImage(Base):
    """Modèle pour les images des annonces"""
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(500), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relation inverse
    property = relationship("Property", back_populates="images")


class Gallery(Base):
    """Modèle pour les images de la galerie"""
    __tablename__ = "gallery"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(500), nullable=False)
    filepath = Column(String(500), nullable=False)
    image_type = Column(String(50), nullable=False)  # immobilier, construction, electricite, etc.
    title = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Service(Base):
    """Modèle pour les services de l'entreprise"""
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50), nullable=True)
    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)
    features = Column(Text, nullable=True)  # Liste JSON des prestations
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ContactMessage(Base):
    """Modèle pour les messages de contact"""
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    message = Column(Text, nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="SET NULL"), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Testimonial(Base):
    """Modèle pour les témoignages clients"""
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=True)
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
