"""
Point d'entrée principal de l'API FastAPI
GICOS - Galaxie Immobilière Construction et Services
"""

import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
from models import User, Service
from auth import get_password_hash

# Import des routers
from routers import auth, properties, gallery, contact, services, testimonials

# Créer les tables de la base de données
Base.metadata.create_all(bind=engine)

# Initialisation de l'application FastAPI
app = FastAPI(
    title="GICOS API",
    description="API pour Galaxie Immobilière Construction et Services",
    version="1.0.0"
)

# Configuration CORS (CORS_ORIGINS = URLs séparées par des virgules)
_default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
_extra = os.getenv("CORS_ORIGINS", "")
allow_origins = list(_default_origins)
if _extra.strip():
    allow_origins.extend(
        o.strip() for o in _extra.split(",") if o.strip()
    )

# Autoriser tous les déploiements Vercel (*.vercel.app)
_cors_regex = os.getenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=_cors_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Créer le dossier uploads s'il n'existe pas
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Servir les fichiers statiques (images uploadées)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Inclure les routers
app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(gallery.router)
app.include_router(contact.router)
app.include_router(services.router)
app.include_router(testimonials.router)


def init_admin_user(db: Session):
    """Crée l'utilisateur admin par défaut s'il n'existe pas."""
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            password_hash=get_password_hash("admin123"),
            is_admin=True
        )
        db.add(admin)
        db.commit()
        print("[OK] Utilisateur admin créé (login: admin, mot de passe: admin123)")


def init_default_services(db: Session):
    """Crée les services par défaut s'ils n'existent pas."""
    services_data = [
        {
            "name": "Immobilier",
            "slug": "immobilier",
            "icon": "building",
            "short_description": "Vente et location de biens immobiliers de qualité",
            "full_description": "Notre service immobilier vous accompagne dans tous vos projets d'achat, de vente ou de location. Avec une expertise approfondie du marché local, nous vous aidons à trouver le bien idéal correspondant à vos besoins et votre budget.",
            "features": json.dumps([
                "Vente de maisons et appartements",
                "Location longue durée",
                "Estimation gratuite",
                "Accompagnement juridique",
                "Conseil en investissement"
            ]),
            "order_index": 1
        },
        {
            "name": "Construction",
            "slug": "construction",
            "icon": "hammer",
            "short_description": "Construction de bâtiments résidentiels et commerciaux",
            "full_description": "GICOS vous propose des services de construction clé en main. De la conception à la réalisation, notre équipe de professionnels qualifiés vous accompagne pour concrétiser votre projet de construction.",
            "features": json.dumps([
                "Construction neuve",
                "Rénovation complète",
                "Extension de bâtiments",
                "Gros œuvre et second œuvre",
                "Respect des délais et budgets"
            ]),
            "order_index": 2
        },
        {
            "name": "Électricité",
            "slug": "electricite",
            "icon": "zap",
            "short_description": "Installation et maintenance électrique professionnelle",
            "full_description": "Nos électriciens qualifiés assurent tous vos travaux d'installation, de rénovation et de dépannage électrique en respectant les normes en vigueur.",
            "features": json.dumps([
                "Installation électrique complète",
                "Mise aux normes",
                "Dépannage rapide",
                "Éclairage intérieur et extérieur",
                "Tableaux électriques"
            ]),
            "order_index": 3
        },
        {
            "name": "Carrelage",
            "slug": "carrelage",
            "icon": "grid",
            "short_description": "Pose de carrelage et revêtements de sol",
            "full_description": "Experts en pose de carrelage, nous transformons vos espaces avec des revêtements de sol et muraux de haute qualité. Du traditionnel au moderne, nous réalisons tous vos projets.",
            "features": json.dumps([
                "Carrelage sol et mur",
                "Faïence salle de bain",
                "Mosaïque décorative",
                "Pose de parquet",
                "Terrasses extérieures"
            ]),
            "order_index": 4
        },
        {
            "name": "Plomberie",
            "slug": "plomberie",
            "icon": "droplet",
            "short_description": "Services de plomberie et sanitaires",
            "full_description": "Notre équipe de plombiers professionnels intervient pour tous vos besoins en plomberie : installation, réparation et entretien de vos équipements sanitaires.",
            "features": json.dumps([
                "Installation sanitaire",
                "Réparation de fuites",
                "Chauffe-eau et chaudières",
                "Débouchage canalisations",
                "Création salle de bain"
            ]),
            "order_index": 5
        },
        {
            "name": "Peinture / Staff",
            "slug": "peinture",
            "icon": "paintbrush",
            "short_description": "Peinture intérieure, extérieure et décoration staff",
            "full_description": "Donnez vie à vos murs avec nos services de peinture professionnelle et de décoration en staff. Finitions soignées et résultats durables garantis.",
            "features": json.dumps([
                "Peinture intérieure",
                "Peinture extérieure",
                "Décoration staff",
                "Revêtements muraux",
                "Conseils couleurs"
            ]),
            "order_index": 6
        },
        {
            "name": "Sonorisation",
            "slug": "sonorisation",
            "icon": "volume-2",
            "short_description": "Solutions audio et sonorisation professionnelle",
            "full_description": "GICOS propose des services de sonorisation pour tous vos événements et installations permanentes. Matériel professionnel et techniciens expérimentés à votre service.",
            "features": json.dumps([
                "Sonorisation événementielle",
                "Installation home cinéma",
                "Systèmes audio professionnels",
                "Location de matériel",
                "Assistance technique"
            ]),
            "order_index": 7
        }
    ]
    
    for service_data in services_data:
        existing = db.query(Service).filter(Service.slug == service_data["slug"]).first()
        if not existing:
            service = Service(**service_data)
            db.add(service)
    
    db.commit()
    print("[OK] Services par défaut initialisés")


@app.on_event("startup")
async def startup_event():
    """Initialisation au démarrage de l'application."""
    db = SessionLocal()
    try:
        init_admin_user(db)
        init_default_services(db)
    finally:
        db.close()
    print("[START] API GICOS démarrée sur http://localhost:8000")
    print("[DOC] Documentation: http://localhost:8000/docs")


@app.get("/")
async def root():
    """Route racine de l'API."""
    return {
        "message": "Bienvenue sur l'API GICOS",
        "version": "1.0.0",
        "documentation": "/docs"
    }


@app.get("/api/health")
async def health_check():
    """Vérification de l'état de l'API."""
    return {"status": "ok", "message": "API fonctionnelle"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

