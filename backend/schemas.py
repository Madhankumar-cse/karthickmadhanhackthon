from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class PredictionInput(BaseModel):
    Year: int = Field(..., ge=1990, le=2035, description="Crop planting/harvest year")
    State: str = Field(..., min_length=2, max_length=100, description="Agricultural state")
    Crop: str = Field(..., min_length=2, max_length=100, description="Crop name")
    Season: str = Field(..., min_length=2, max_length=50, description="Crop season, e.g., Kharif, Rabi")
    Area: float = Field(..., gt=0.0, description="Cultivated land area in hectares")
    Annual_Rainfall: float = Field(..., ge=0.0, description="Annual rainfall in millimeters")
    Fertilizer: float = Field(..., ge=0.0, description="Fertilizer quantity in kilograms/metric units")
    Pesticide: float = Field(..., ge=0.0, description="Pesticide application in kilograms/metric units")

    class Config:
        json_schema_extra = {
            "example": {
                "Year": 2020,
                "State": "Tamil Nadu",
                "Crop": "Rice",
                "Season": "Kharif",
                "Area": 2.5,
                "Annual_Rainfall": 900.0,
                "Fertilizer": 500.0,
                "Pesticide": 100.0
            }
        }

class PredictionResponse(BaseModel):
    id: int
    predicted_yield: float
    expected_production: float
    unit: str = "tons/hectare"
    production_unit: str = "metric tons"
    input_data: Optional[Dict[str, Any]] = None

class PredictionRecord(BaseModel):
    id: int
    year: int
    state: str
    crop: str
    season: str
    area: float
    annual_rainfall: float
    fertilizer: float
    pesticide: float
    predicted_yield: float
    expected_production: float
    created_at: datetime

    class Config:
        from_attributes = True

class ModelMetadataResponse(BaseModel):
    model_name: str
    version: str
    features: List[str]
    target: str
    target_unit: str
    production_unit: str
    evaluation_metrics: Dict[str, Any]
    feature_importance: List[Dict[str, Any]]
    supported_states: List[str]
    supported_crops: List[str]
    supported_seasons: List[str]
    created_at: str
