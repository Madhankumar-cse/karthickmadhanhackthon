from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from backend.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    year = Column(Integer, nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    crop = Column(String(100), nullable=False, index=True)
    season = Column(String(50), nullable=False)
    area = Column(Float, nullable=False)
    annual_rainfall = Column(Float, nullable=False)
    fertilizer = Column(Float, nullable=False)
    pesticide = Column(Float, nullable=False)
    predicted_yield = Column(Float, nullable=False)
    expected_production = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
