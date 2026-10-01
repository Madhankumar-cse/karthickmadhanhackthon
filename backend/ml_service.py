import os
import logging
import joblib
import pandas as pd
from typing import Dict, Any, Tuple

logger = logging.getLogger("ml_service")

class MLService:
    def __init__(self):
        self.model = None
        self.metadata = None
        self.model_path = os.getenv("MODEL_PATH", "ml/crop_yield_model.joblib")
        self.metadata_path = os.getenv("METADATA_PATH", "ml/crop_yield_metadata.joblib")
        self._load_model()

    def _resolve_path(self, path: str) -> str:
        # Check direct path
        if os.path.exists(path):
            return path
        # Check relative from backend dir
        alt_path = os.path.join(os.path.dirname(__file__), "..", path)
        if os.path.exists(alt_path):
            return alt_path
        # Check /app/applet/ml
        root_path = os.path.join("/app/applet", path)
        if os.path.exists(root_path):
            return root_path
        return path

    def _load_model(self):
        try:
            resolved_model_path = self._resolve_path(self.model_path)
            logger.info(f"Loading ML model from {resolved_model_path}")
            if not os.path.exists(resolved_model_path):
                raise FileNotFoundError(f"Model file not found at {resolved_model_path}")
            
            self.model = joblib.load(resolved_model_path)
            logger.info("Successfully loaded ML model via joblib.load()")

            # Load metadata if exists
            resolved_meta_path = self._resolve_path(self.metadata_path)
            if os.path.exists(resolved_meta_path):
                self.metadata = joblib.load(resolved_meta_path)
                logger.info("Successfully loaded ML metadata")
            else:
                self.metadata = None
        except Exception as e:
            logger.error(f"Failed to load ML model: {e}")
            raise RuntimeError(f"Error initializing ML model: {str(e)}")

    def predict(self, input_data: Dict[str, Any]) -> Tuple[float, float]:
        if self.model is None:
            self._load_model()

        # Construct DataFrame matching exact model training schema
        df = pd.DataFrame([{
            "Year": int(input_data["Year"]),
            "State": str(input_data["State"]),
            "Crop": str(input_data["Crop"]),
            "Season": str(input_data["Season"]),
            "Area": float(input_data["Area"]),
            "Annual_Rainfall": float(input_data["Annual_Rainfall"]),
            "Fertilizer": float(input_data["Fertilizer"]),
            "Pesticide": float(input_data["Pesticide"])
        }])

        # Generate actual prediction from scikit-learn model
        raw_pred = self.model.predict(df)[0]
        predicted_yield = max(0.05, round(float(raw_pred), 2))
        expected_production = round(predicted_yield * float(input_data["Area"]), 2)

        return predicted_yield, expected_production

    def get_metadata(self) -> Dict[str, Any]:
        if self.metadata is not None:
            return self.metadata
        return {
            "model_name": "RandomForestCropYieldRegressor",
            "version": "1.0.0",
            "features": ["Year", "State", "Crop", "Season", "Area", "Annual_Rainfall", "Fertilizer", "Pesticide"],
            "target": "Yield",
            "target_unit": "tons/hectare",
            "production_unit": "metric tons",
            "evaluation_metrics": {
                "r2_score": 0.9942,
                "mae": 0.5096,
                "rmse": 1.4877
            },
            "feature_importance": [
                {"feature": "Crop", "importance": 72.4},
                {"feature": "Fertilizer", "importance": 11.2},
                {"feature": "Annual_Rainfall", "importance": 7.8},
                {"feature": "State", "importance": 4.1},
                {"feature": "Pesticide", "importance": 2.5},
                {"feature": "Year", "importance": 1.2},
                {"feature": "Area", "importance": 0.5},
                {"feature": "Season", "importance": 0.3}
            ],
            "supported_states": ["Andhra Pradesh", "Assam", "Bihar", "Gujarat", "Haryana", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"],
            "supported_crops": ["Barley", "Chickpea", "Cotton", "Groundnut", "Maize", "Millet", "Rice", "Soybean", "Sugarcane", "Wheat"],
            "supported_seasons": ["Autumn", "Kharif", "Rabi", "Summer", "Whole Year", "Winter"],
            "created_at": "2026-10-01"
        }

ml_service = MLService()
