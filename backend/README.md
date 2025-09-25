---
title: AI Internship Recommender Backend
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# AI Internship Recommender Backend

A FastAPI-based backend service for AI-powered internship recommendations using machine learning and vector embeddings.

## Features

- 🤖 AI-powered internship recommendations
- 📄 Resume parsing and analysis
- 🔍 Vector-based similarity search
- 💬 Chatbot integration
- 🗄️ Database management (PostgreSQL/SQLite)
- 🔐 Authentication and authorization
- 📊 Analytics and tracking

## API Endpoints

### Health Check
- `GET /healthz` - Health check endpoint

### Company Routes (`/company`)
- `GET /company/internships` - Get all internships
- `POST /company/internships` - Create new internship
- `GET /company/internships/{id}` - Get specific internship
- `PUT /company/internships/{id}` - Update internship
- `DELETE /company/internships/{id}` - Delete internship

### Student Routes (`/student`)
- `POST /student/register` - Student registration
- `POST /student/login` - Student login
- `POST /student/upload-resume` - Upload resume
- `GET /student/recommendations` - Get AI recommendations
- `POST /student/chat` - Chat with AI assistant

## Environment Variables

Set these in your Hugging Face Space settings:

- `DATABASE_URL` - Database connection string
- `GOOGLE_API_KEY` - Google API key for Gemini embeddings
- `HUGGINGFACE_API_TOKEN` - Hugging Face API token
- `SESSION_SECRET` - Secret key for sessions
- `JWT_SECRET_KEY` - Secret key for JWT tokens
- `CORS_ORIGINS` - Allowed CORS origins

## Deployment

This backend is optimized for Hugging Face Spaces deployment with Docker.

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port 8000
```

## License

MIT License