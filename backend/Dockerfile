FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# The app uses relative imports, so it has to live in a "backend" package
WORKDIR /app

COPY requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY . backend

EXPOSE 8000

# Create any missing tables, then start the API
CMD ["sh", "-c", "python -c 'from backend.models import Base; from backend.services.db import engine; Base.metadata.create_all(engine)' && uvicorn backend.main:app --host 0.0.0.0 --port 8000"]
