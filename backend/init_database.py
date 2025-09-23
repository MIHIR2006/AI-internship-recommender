#!/usr/bin/env python3
"""
Database initialization script for production deployment.
This script creates all necessary tables and initializes the database.
"""

import os
import sys
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from db.database import Base, engine
from db.models import Internship, User, ResumeSummary
from utils.config import DATABASE_URL

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_database_connection():
    """Test database connection and return True if successful."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            logger.info("✅ Database connection successful")
            return True
    except OperationalError as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False

def create_tables():
    """Create all database tables."""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to create tables: {e}")
        return False

def verify_tables():
    """Verify that all required tables exist."""
    try:
        with engine.connect() as conn:
            # Check if tables exist
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name IN ('users', 'internships', 'resume_summaries')
            """))
            tables = [row[0] for row in result.fetchall()]
            
            required_tables = ['users', 'internships', 'resume_summaries']
            missing_tables = set(required_tables) - set(tables)
            
            if missing_tables:
                logger.error(f"❌ Missing tables: {missing_tables}")
                return False
            
            logger.info(f"✅ All required tables exist: {tables}")
            return True
    except Exception as e:
        logger.error(f"❌ Failed to verify tables: {e}")
        return False

def main():
    """Main initialization function."""
    logger.info("🚀 Starting database initialization...")
    logger.info(f"Database URL: {DATABASE_URL}")
    
    # Test connection
    if not test_database_connection():
        logger.error("❌ Cannot proceed without database connection")
        sys.exit(1)
    
    # Create tables
    if not create_tables():
        logger.error("❌ Failed to create tables")
        sys.exit(1)
    
    # Verify tables
    if not verify_tables():
        logger.error("❌ Table verification failed")
        sys.exit(1)
    
    logger.info("✅ Database initialization completed successfully!")
    return 0

if __name__ == "__main__":
    sys.exit(main())
