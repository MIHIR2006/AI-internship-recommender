$env:RUN_DB_CREATE_ALL = "true"
$env:DATABASE_URL = "sqlite:///./internships.db"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000


