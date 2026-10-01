#!/usr/bin/env python3
import sys
import json
import os

# Set root path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database import SessionLocal, Base, engine
from backend.models import Prediction
from backend.ml_service import ml_service

def init_db():
    Base.metadata.create_all(bind=engine)

def handle_predict(input_data):
    init_db()
    predicted_yield, expected_production = ml_service.predict(input_data)
    
    db = SessionLocal()
    try:
        record = Prediction(
            year=int(input_data["Year"]),
            state=str(input_data["State"]),
            crop=str(input_data["Crop"]),
            season=str(input_data["Season"]),
            area=float(input_data["Area"]),
            annual_rainfall=float(input_data["Annual_Rainfall"]),
            fertilizer=float(input_data["Fertilizer"]),
            pesticide=float(input_data["Pesticide"]),
            predicted_yield=predicted_yield,
            expected_production=expected_production
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "id": record.id,
            "predicted_yield": predicted_yield,
            "expected_production": expected_production,
            "unit": "tons/hectare",
            "production_unit": "metric tons",
            "input_data": input_data
        }
    finally:
        db.close()

def handle_list_predictions():
    init_db()
    db = SessionLocal()
    try:
        records = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(100).all()
        return [
            {
                "id": r.id,
                "year": r.year,
                "state": r.state,
                "crop": r.crop,
                "season": r.season,
                "area": r.area,
                "annual_rainfall": r.annual_rainfall,
                "fertilizer": r.fertilizer,
                "pesticide": r.pesticide,
                "predicted_yield": r.predicted_yield,
                "expected_production": r.expected_production,
                "created_at": r.created_at.isoformat()
            }
            for r in records
        ]
    finally:
        db.close()

def handle_get_prediction(pred_id):
    init_db()
    db = SessionLocal()
    try:
        r = db.query(Prediction).filter(Prediction.id == pred_id).first()
        if not r:
            return None
        return {
            "id": r.id,
            "year": r.year,
            "state": r.state,
            "crop": r.crop,
            "season": r.season,
            "area": r.area,
            "annual_rainfall": r.annual_rainfall,
            "fertilizer": r.fertilizer,
            "pesticide": r.pesticide,
            "predicted_yield": r.predicted_yield,
            "expected_production": r.expected_production,
            "created_at": r.created_at.isoformat()
        }
    finally:
        db.close()

def handle_metadata():
    return ml_service.get_metadata()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing command"}))
        sys.exit(1)
        
    cmd = sys.argv[1]
    
    if cmd == "predict":
        try:
            raw_input = sys.stdin.read() if not sys.stdin.isatty() else sys.argv[2]
            payload = json.loads(raw_input)
            result = handle_predict(payload)
            print(json.dumps(result))
        except Exception as e:
            print(json.dumps({"error": str(e)}), file=sys.stderr)
            sys.exit(1)
            
    elif cmd == "list":
        try:
            results = handle_list_predictions()
            print(json.dumps(results))
        except Exception as e:
            print(json.dumps({"error": str(e)}), file=sys.stderr)
            sys.exit(1)
            
    elif cmd == "get":
        try:
            pred_id = int(sys.argv[2])
            res = handle_get_prediction(pred_id)
            if res is None:
                print(json.dumps({"error": "Not found"}), file=sys.stderr)
                sys.exit(44)
            print(json.dumps(res))
        except Exception as e:
            print(json.dumps({"error": str(e)}), file=sys.stderr)
            sys.exit(1)
            
    elif cmd == "metadata":
        try:
            meta = handle_metadata()
            print(json.dumps(meta))
        except Exception as e:
            print(json.dumps({"error": str(e)}), file=sys.stderr)
            sys.exit(1)
            
    else:
        print(json.dumps({"error": f"Unknown command {cmd}"}), file=sys.stderr)
        sys.exit(1)
