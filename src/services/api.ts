import { PredictionInput, PredictionResult, PredictionRecord, ModelMetadata } from '../types/prediction';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
  async predict(data: PredictionInput): Promise<PredictionResult> {
    const url = `${BASE_URL}/predict`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate forecast.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.error || errorMessage;
      } catch {
        errorMessage = `Server returned error (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async getPredictions(): Promise<PredictionRecord[]> {
    const url = `${BASE_URL}/predictions`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch prediction history (${response.status})`);
    }
    return response.json();
  },

  async getPredictionById(id: number): Promise<PredictionRecord> {
    const url = `${BASE_URL}/predictions/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to retrieve prediction record #${id}`);
    }
    return response.json();
  },

  async getModelMetadata(): Promise<ModelMetadata> {
    const url = `${BASE_URL}/model-metadata`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to retrieve model intelligence metadata');
    }
    return response.json();
  },

  async checkHealth(): Promise<{ status: string; model_loaded: boolean; database: string }> {
    const url = `${BASE_URL}/health`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('System health check failed');
    }
    return response.json();
  }
};
