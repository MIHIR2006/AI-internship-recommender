FROM python:3.11-slim

# Set environment variables for Hugging Face Spaces
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/cache/hf \
    PORT=7860 \
    SPACE_ID=Al-internship-recommender

# Run in production mode by default on Hugging Face Spaces
ENV ENVIRONMENT=production

WORKDIR /app

# System dependencies optimized for Hugging Face Spaces
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpq-dev \
    gcc \
    git \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements first for better Docker layer caching
COPY requirements.txt /app/requirements.txt

# Install Python dependencies with optimizations
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copy application code
COPY . /app

# Create necessary directories for Hugging Face Spaces
RUN mkdir -p /data/vectorstores \
    /data/student_vectorstores \
    /cache/hf \
    /var/data/vectorstores \
    /var/data/student_vectorstores \
    /app/temp_uploads \
    /app/data/chat_histories

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app /data /var/data /cache
USER appuser

# Expose the port that Hugging Face Spaces expects
EXPOSE 7860

# Health check for Hugging Face Spaces
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7860/healthz || exit 1

# Start command optimized for Hugging Face Spaces
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 7860 --workers 1 --log-level info"]


