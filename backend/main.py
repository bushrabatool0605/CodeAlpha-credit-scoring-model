from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
import numpy as np
import joblib
import os

app = FastAPI(title="Credit Scoring API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📂 Path Config: Dynamic checking for local vs Docker environment
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))  # Points to 'backend' folder
PARENT_DIR = os.path.abspath(os.path.join(BACKEND_DIR, os.pardir))  # Points to project root

# Models paths matching your structured directories
MODEL_PATH = os.path.join(PARENT_DIR, "models", "credit_scoring_rf_model.pkl")
SCALER_PATH = os.path.join(PARENT_DIR, "models", "credit_scoring_scaler.pkl")

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model files from structural paths. Error: {e}")


class CreditInput(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Age of borrower")
    times_30_59_days_late: int = Field(..., ge=0, description="Times 30-59 days past due")
    monthly_income: float = Field(..., ge=0, description="Monthly gross income")
    open_credit_lines: int = Field(..., ge=0, description="Open credit lines and loans")
    times_90_days_late: int = Field(..., ge=0, description="Times 90+ days late")
    times_60_89_days_late: int = Field(..., ge=0, description="Times 60-89 days past due")
    number_of_dependents: int = Field(..., ge=0, description="Number of dependents")


@app.get("/api/health")
def health():
    return {"status": "healthy", "message": "Credit Scoring ML API is running smoothly."}


@app.post("/api/predict")
def predict(data: CreditInput):
    try:
        # Dynamic feature engineering
        total_times_late = (
            data.times_30_59_days_late
            + data.times_90_days_late
            + data.times_60_89_days_late
        )
        is_low_income = 1 if data.monthly_income < 3400 else 0

        # Build feature array in the exact strict order expected by scaler
        features = np.array([[
            data.age,
            data.times_30_59_days_late,
            data.monthly_income,
            data.open_credit_lines,
            data.times_90_days_late,
            data.times_60_89_days_late,
            data.number_of_dependents,
            total_times_late,
            is_low_income,
        ]])

        scaled = scaler.transform(features)
        prediction = int(model.predict(scaled)[0])
        probabilities = model.predict_proba(scaled)[0]
        default_probability = round(float(probabilities[1]), 4)

        return {
            "prediction": prediction,
            "default_probability": default_probability,
            "risk_status": "High Risk" if prediction == 1 else "Low Risk",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 🎨 SERVE FRONTEND (Hugging Face / Local Production Setup)
# This will bind the built static React app into your FastAPI deployment
STATIC_DIR = os.path.join(BACKEND_DIR, "static")

if os.path.exists(STATIC_DIR):
    # Serve static assets folder containing CSS and JS bundle items
    assets_dir = os.path.join(STATIC_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    # Catch-all route to serve index.html for Single Page Application (React) router
    @app.get("/{catchall:path}")
    async def serve_frontend(catchall: str):
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))