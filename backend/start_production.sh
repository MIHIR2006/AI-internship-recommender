#!/bin/bash
# Production startup script for Render deployment

set -e  # Exit on any error

echo "🚀 Starting AI Internship Recommender Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
python -c "
import time
import sys
from sqlalchemy import create_engine
from utils.config import DATABASE_URL

max_retries = 30
retry_count = 0

while retry_count < max_retries:
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            conn.execute('SELECT 1')
        print('✅ Database is ready!')
        break
    except Exception as e:
        retry_count += 1
        print(f'⏳ Database not ready yet (attempt {retry_count}/{max_retries}): {e}')
        time.sleep(2)

if retry_count >= max_retries:
    print('❌ Database connection failed after maximum retries')
    sys.exit(1)
"

# Initialize database
echo "🔧 Initializing database..."
python init_database.py

# Start the application
echo "🎯 Starting FastAPI application..."
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1
