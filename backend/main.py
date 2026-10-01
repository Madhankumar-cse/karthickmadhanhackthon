import os
import logging
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from backend.database import engine, Base, get_db
from backend.models import Prediction
from backend.schemas import (
    PredictionInput,
    PredictionResponse,
    PredictionRecord,
    ModelMetadataResponse
)
from backend.ml_service import ml_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cropguard_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    yield

app = FastAPI(
    title="CropGuard AI Pro API",
    description="SSA025 – Crop-yield forecasting system. TEAM ID: TSS002.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"  # Allows flexible cloud deployment across domains
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "CropGuard AI Pro",
        "tagline": "Predict Yield. Understand Risk. Farm Smarter.",
        "problem_statement": "SSA025",
        "team_id": "TSS002"
    }

@app.get("/health")
def health_check():
    model_loaded = ml_service.model is not None
    return {
        "status": "healthy" if model_loaded else "degraded",
        "model_loaded": model_loaded,
        "database": "connected"
    }

@app.get("/model-metadata", response_model=ModelMetadataResponse)
def get_model_metadata():
    try:
        return ml_service.get_metadata()
    except Exception as e:
        logger.error(f"Error retrieving model metadata: {e}")
        raise HTTPException(status_code=500, detail="Unable to retrieve model metadata")

@app.post("/predict", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
def predict_yield(payload: PredictionInput, db: Session = Depends(get_db)):
    try:
        # Validate inputs
        input_dict = payload.model_dump()
        
        # ML Inference via joblib model
        predicted_yield, expected_production = ml_service.predict(input_dict)

        # Store prediction in database
        db_record = Prediction(
            year=payload.Year,
            state=payload.State,
            crop=payload.Crop,
            season=payload.Season,
            area=payload.Area,
            annual_rainfall=payload.Annual_Rainfall,
            fertilizer=payload.Fertilizer,
            pesticide=payload.Pesticide,
            predicted_yield=predicted_yield,
            expected_production=expected_production
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return PredictionResponse(
            id=db_record.id,
            predicted_yield=predicted_yield,
            expected_production=expected_production,
            unit="tons/hectare",
            production_unit="metric tons",
            input_data=input_dict
        )

    except ValueError as ve:
        logger.error(f"Validation error in prediction: {ve}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Inference or persistence error: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Yield forecasting calculation failed. Please verify input parameters."
        )

@app.get("/predictions", response_model=List[PredictionRecord])
def list_predictions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        records = db.query(Prediction).order_by(Prediction.created_at.desc()).offset(skip).limit(limit).all()
        return records
    except Exception as e:
        logger.error(f"Error retrieving prediction history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch prediction history from database")

@app.get("/predictions/{prediction_id}", response_model=PredictionRecord)
def get_prediction(prediction_id: int, db: Session = Depends(get_db)):
    try:
        record = db.query(Prediction).filter(Prediction.id == prediction_id).first()
        if not record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Prediction #{prediction_id} not found")
        return record
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying prediction #{prediction_id}: {e}")
        raise HTTPException(status_code=500, detail="Database query error")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)
