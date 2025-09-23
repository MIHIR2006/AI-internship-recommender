from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from utils.config import DATABASE_URL
from urllib.parse import urlparse
import os
import logging

Base = declarative_base()
logger = logging.getLogger(__name__)

# Configure engine depending on driver (sqlite vs postgres/etc.)
def _normalize_database_url(url: str) -> str:
    # Railway and older libs sometimes use postgres:// which SQLAlchemy warns about
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    # Allow postgresql:// and postgresql+psycopg2:// as-is
    return url


_raw_url = DATABASE_URL
_url = urlparse(_raw_url)
_normalized_url = _normalize_database_url(_raw_url)

if _url.scheme.startswith("sqlite"):
    engine = create_engine(
        _normalized_url,
        connect_args={"check_same_thread": False}
    )
else:
    # Reasonable defaults for production Postgres
    pool_size = int(os.getenv("DB_POOL_SIZE", "5"))
    max_overflow = int(os.getenv("DB_MAX_OVERFLOW", "10"))
    pool_timeout = int(os.getenv("DB_POOL_TIMEOUT", "30"))
    pool_recycle = int(os.getenv("DB_POOL_RECYCLE", "1800"))  # 30 minutes

    try:
        engine = create_engine(
            _normalized_url,
            pool_pre_ping=True,
            pool_size=pool_size,
            max_overflow=max_overflow,
            pool_timeout=pool_timeout,
            pool_recycle=pool_recycle,
        )
        # Proactively test the connection to avoid failing on import sites
        with engine.connect() as _:
            pass
    except Exception as e:
        # Fall back to local SQLite for development when Postgres isn't reachable
        logger.warning(f"Postgres not reachable, falling back to SQLite. Reason: {e}")
        engine = create_engine(
            "sqlite:///./internships.db",
            connect_args={"check_same_thread": False}
        )
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()