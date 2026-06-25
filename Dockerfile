# --- STAGE 1: Build React Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- STAGE 2: Serve via FastAPI Backend ---
FROM python:3.10-slim
WORKDIR /app

# System requirements for machine learning dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python packages
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Project tracking files copy karein
COPY backend/ /app/backend/
COPY models/ /app/models/

# React ke build production folder ko FastAPI static path me shift karein
COPY --from=frontend-builder /app/frontend/dist /app/backend/static

# Hugging Face default port standard configuration 
EXPOSE 7860

# FastAPI main server initiate script (running on port 7860)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]