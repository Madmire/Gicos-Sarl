"""
Configuration de la base de données SQLAlchemy
GICOS - Galaxie Immobilière Construction et Services

Prod (Neon) : DATABASE_URL=postgresql://...
Dev local   : SQLite ./gicos.db (défaut)
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


def _normalize_database_url(url: str) -> str:
    # Heroku/Neon legacy scheme
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
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
