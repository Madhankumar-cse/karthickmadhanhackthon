export interface PredictionInput {
  Year: number;
  State: string;
  Crop: string;
  Season: string;
  Area: number;
  Annual_Rainfall: number;
  Fertilizer: number;
  Pesticide: number;
}

export interface PredictionResult {
  id: number;
  predicted_yield: number;
  expected_production: number;
  unit: string;
  production_unit?: string;
  input_data?: PredictionInput;
}

export interface PredictionRecord {
  id: number;
  year: number;
  state: string;
  crop: string;
  season: string;
  area: number;
  annual_rainfall: number;
  fertilizer: number;
  pesticide: number;
  predicted_yield: number;
  expected_production: number;
  created_at: string;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
}

export interface ModelMetadata {
  model_name: string;
  version: string;
  features: string[];
  target: string;
  target_unit: string;
  production_unit: string;
  evaluation_metrics: {
    r2_score?: number;
    mae?: number;
    rmse?: number;
    train_samples?: number;
    test_samples?: number;
  };
  feature_importance: FeatureImportanceItem[];
  supported_states: string[];
  supported_crops: string[];
  supported_seasons: string[];
  created_at: string;
}
