# CropGuard AI Pro

> **Predict Yield. Understand Risk. Farm Smarter.**  
> **SSA025 – Crop-Yield Forecasting System**  
> **TEAM ID: TSS002**

---

## 1. Project Overview

**CropGuard AI Pro** is a production-grade full-stack agricultural decision-support web platform designed to solve **Problem Statement SSA025**. It estimates expected crop yield and total harvest volume prior to planting by modeling historical crop varieties, regional agro-climatic conditions, seasonal cycles, rainfall volume, and chemical inputs (fertilizer and pesticide).

Crucially, CropGuard AI Pro identifies the factors influencing predictions through an Explainable AI matrix and adheres strictly to agronomic and scientific rigor:
- **Zero Target Leakage:** Crop production is never an input feature. Expected production is calculated post-inference as $\text{Yield (tons/ha)} \times \text{Cultivated Area (ha)}$.
- **No Mock or Random Predictions:** Every forecast is evaluated against an authentic trained Scikit-Learn regression model pipeline serialized in `ml/crop_yield_model.joblib`.
- **Relational Persistence:** Every forecast is permanently recorded in a PostgreSQL database (with automatic SQLite fallback for local development).
- **SDG 2 Alignment:** Directly supports United Nations Sustainable Development Goal 2 (Zero Hunger), specifically Targets 2.3 and 2.4.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (with bespoke AgriTech color palette)
- **Icons:** Lucide React
- **Data Visualization:** Recharts (Yield Trend, Crop Distribution, Productivity Comparison)

### Backend
- **Framework:** Python FastAPI & Node.js Express API Bridge
- **Schema Validation:** Pydantic v2
- **ORM / Database:** SQLAlchemy & PostgreSQL (psycopg2-binary)

### Machine Learning
- **Environment:** Python 3.10+
- **Data Structures:** Pandas & NumPy
- **ML Framework:** Scikit-Learn & XGBoost
- **Serialization:** Joblib

### Architecture & APIs
- **Protocol:** REST API with JSON payloads
- **CORS:** Configured for cross-origin deployments

---

## 3. Project Directory Architecture

```
CropGuard-AI-Pro/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ArchitectureFlow.tsx
│   │   │   ├── ExplainableAISection.tsx
│   │   │   └── PredictionDetailsModal.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ForecastPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── HowItWorksPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   │   └── usePredictions.ts
│   │   ├── types/
│   │   │   └── prediction.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── ml_service.py
│   ├── predict_runner.py
│   ├── requirements.txt
│   └── .env.example
│
├── ml/
│   ├── train_model.py
│   ├── crop_yield_model.joblib
│   └── crop_yield_metadata.joblib
│
├── server.ts
├── package.json
└── README.md
```

---

## 4. Machine Learning Model & Pipeline

### Input Features:
1. `Year` (Cultivation season year, e.g., 2020)
2. `State` (Geographic region/soil zone, e.g., Tamil Nadu, Punjab)
3. `Crop` (Crop variety, e.g., Rice, Wheat, Maize, Cotton, Sugarcane)
4. `Season` (Kharif, Rabi, Summer, Whole Year, Autumn, Winter)
5. `Area` (Cultivated land in hectares)
6. `Annual_Rainfall` (Annual precipitation in millimeters)
7. `Fertilizer` (Fertilizer applied in kg)
8. `Pesticide` (Pesticide applied in kg)

### Target Variable:
- **`Yield`**: Metric tons per hectare ($\text{tons/ha}$).

### Calculated Output:
- **`Expected Production`**: $\text{Yield} \times \text{Area}$ (metric tons).

### Training Pipeline:
```python
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), ["Year", "Area", "Annual_Rainfall", "Fertilizer", "Pesticide"]),
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["State", "Crop", "Season"])
    ]
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=120, max_depth=16, random_state=42))
])
```

---

## 5. REST API Documentation

### Base URL:
`/` or configured `VITE_API_URL` (default: `http://localhost:8000`)

### Endpoints:

#### 1. System Health
- **`GET /health`**
- Response:
  ```json
  {
    "status": "healthy",
    "model_loaded": true,
    "database": "connected"
  }
  ```

#### 2. Model Metadata & Explainable AI
- **`GET /model-metadata`**
- Returns model architecture, training evaluation metrics ($R^2$, MAE, RMSE), supported states, and feature importance percentages.

#### 3. Yield Prediction
- **`POST /predict`**
- Request Payload:
  ```json
  {
    "Year": 2020,
    "State": "Tamil Nadu",
    "Crop": "Rice",
    "Season": "Kharif",
    "Area": 2.5,
    "Annual_Rainfall": 900.0,
    "Fertilizer": 500.0,
    "Pesticide": 100.0
  }
  ```
- Response (HTTP 201):
  ```json
  {
    "id": 1,
    "predicted_yield": 4.33,
    "expected_production": 10.82,
    "unit": "tons/hectare",
    "production_unit": "metric tons"
  }
  ```

#### 4. Historical Predictions
- **`GET /predictions`**
- Returns array of past predictions ordered by `created_at` descending.

#### 5. Single Prediction Record
- **`GET /predictions/{id}`**
- Returns specific record by database primary key.

---

## 6. Environment Variables

### Frontend (`.env`):
```env
VITE_API_URL=http://localhost:8000
```
*(Leave empty when running unified full-stack server on port 3000)*

### Backend (`backend/.env`):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cropguard
MODEL_PATH=../ml/crop_yield_model.joblib
METADATA_PATH=../ml/crop_yield_metadata.joblib
PORT=8000
```

---

## 7. Local Development Guide

### A. Unified Full-Stack Run (Port 3000)
Run both the React frontend and integrated Python ML runner via Node:
```bash
# 1. Install Node dependencies
npm install

# 2. Start server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### B. Standalone Python FastAPI Backend (Port 8000)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### C. Standalone Vite Frontend (Port 5173 / 3000)
```bash
cd frontend
npm install
npm run dev
```

---

## 8. Deployment Compatibility

- **Frontend:** Compatible with Vercel, Netlify, Cloudflare Pages, AWS Amplify.
- **Backend:** Compatible with Render, Railway, Google Cloud Run, AWS ECS/EC2.
- **Database:** Compatible with Supabase, AWS RDS, Neon, Google Cloud SQL (PostgreSQL).

---

## 9. Team & Compliance

- **Problem Statement:** SSA025 – Crop-Yield Forecasting System
- **Team ID:** **TSS002**
- **Disclaimers:** Predictions are empirical mathematical models for agronomic decision support. They do not constitute guaranteed yields or commercial warranties.
