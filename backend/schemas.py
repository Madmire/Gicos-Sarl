"""
Schémas Pydantic pour la validation des données
GICOS - Galaxie Immobilière Construction et Services
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ==================== User Schemas ====================

class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    is_admin: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# ==================== Property Schemas ====================

class PropertyImageBase(BaseModel):
    filename: str
    is_primary: bool = False


class PropertyImageResponse(PropertyImageBase):
    id: int
    property_id: int

    class Config:
        from_attributes = True


class PropertyBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    city: str = Field(..., min_length=1, max_length=100)
    property_type: str = Field(..., pattern="^(vente|location)$")
    category: Optional[str] = None
    surface: Optional[float] = None
    rooms: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    living_rooms: Optional[int] = None
    kitchens: Optional[int] = None
    garage: bool = False
    garden: bool = False
    featured: bool = False


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    city: Optional[str] = None
    property_type: Optional[str] = None
    category: Optional[str] = None
    surface: Optional[float] = None
    rooms: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    living_rooms: Optional[int] = None
    kitchens: Optional[int] = None
    garage: Optional[bool] = None
    garden: Optional[bool] = None
    featured: Optional[bool] = None


class PropertyResponse(PropertyBase):
    id: int
    images: List[PropertyImageResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class PropertyListResponse(BaseModel):
    id: int
    title: str
    price: float
    city: str
    property_type: str
    category: Optional[str]
    surface: Optional[float]
    rooms: Optional[int]
    bedrooms: Optional[int]
    bathrooms: Optional[int]
    primary_image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Gallery Schemas ====================

class GalleryBase(BaseModel):
    image_type: str
    title: Optional[str] = None
    description: Optional[str] = None


class GalleryCreate(GalleryBase):
    filename: str
    filepath: str


class GalleryResponse(GalleryBase):
    id: int
    filename: str
    filepath: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Service Schemas ====================

class ServiceBase(BaseModel):
    name: str
    slug: str
    icon: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    features: Optional[str] = None  # JSON string
    order_index: int = 0
    is_active: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    features: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True


# ==================== Contact Schemas ====================

class ContactBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., max_length=100)
    phone: Optional[str] = None
    message: str = Field(..., min_length=1)
    property_id: Optional[int] = None


class ContactCreate(ContactBase):
    pass


class ContactResponse(ContactBase):
    id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Testimonial Schemas ====================

class TestimonialBase(BaseModel):
    name: str
    role: Optional[str] = None
    content: str
    rating: int = Field(default=5, ge=1, le=5)
    is_active: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialSubmit(BaseModel):
    """Soumission publique — modération requise avant publication."""
    name: str = Field(..., min_length=2, max_length=100)
    role: Optional[str] = Field(None, max_length=100)
    content: str = Field(..., min_length=10, max_length=2000)
    rating: int = Field(default=5, ge=1, le=5)


class TestimonialResponse(TestimonialBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
