"""
Configuration de la base de données SQLAlchemy
GICOS - Galaxie Immobilière Construction et Services

Prod (Neon) : DATABASE_URL=postgresql://...
Dev local   : SQLite ./gicos.db (défaut si DATABASE_URL absent)
"""

import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Charger backend/.env puis .env racine (sans écraser l'env système)
try:
    from dotenv import load_dotenv

    _backend_dir = Path(__file__).resolve().parent
    load_dotenv(_backend_dir / ".env")
    load_dotenv(_backend_dir.parent / ".env")
except ImportError:
    pass


def _normalize_database_url(url: str) -> str:
    # Heroku/Neon legacy scheme
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    # channel_binding peut poser problème avec certains drivers
    if "channel_binding=" in url:
        parts = []
        for part in url.split("&"):
            if not part.startswith("channel_binding="):
                parts.append(part)
        url = "&".join(parts)
    return url


SQLALCHEMY_DATABASE_URL = _normalize_database_url(
    os.getenv("DATABASE_URL", "sqlite:///./gicos.db")
)

_connect_args = {}
_engine_kwargs = {}

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    _connect_args = {"check_same_thread": False}
else:
    # Neon / Postgres : pooling raisonnable pour Render
    _engine_kwargs = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=_connect_args,
    **_engine_kwargs,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    Générateur de session de base de données.
    Utilisé comme dépendance dans les routes FastAPI.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
