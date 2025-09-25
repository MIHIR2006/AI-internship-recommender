from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.gzip import GZipMiddleware
import os
import logging
from db.database import Base, engine
from db.models import Internship
from routes import internship_routes, student_routes
from utils.config import CORS_ORIGINS

# Configure logging for production
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize database tables
if os.getenv("RUN_DB_CREATE_ALL", "true").lower() in {"1", "true", "yes"}:
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")

# Create FastAPI app with production settings
app = FastAPI(
    title="AI Internship Recommender",
    description="AI-powered internship recommendation system",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") != "production" else None,
)

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

# Compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Session middleware for storing student_id after login
SESSION_SECRET = os.environ.get("SESSION_SECRET", "change-this-secret-in-production")
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET)

# CORS middleware with production settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(internship_routes.router, prefix="/company", tags=["Company"])
app.include_router(student_routes.router, prefix="/student", tags=["Student"])

@app.get("/")
async def root():
    """Root endpoint with basic information"""
    return {
        "message": "AI Internship Recommender API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs" if os.getenv("ENVIRONMENT") != "production" else "disabled"
    }

@app.get("/healthz")
def healthz():
    """Health check endpoint for Hugging Face Spaces"""
    return {
        "status": "ok",
        "service": "AI Internship Recommender",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    """Alternative health check endpoint"""
    return {"status": "healthy"}

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests for monitoring"""
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response
