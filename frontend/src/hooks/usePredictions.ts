import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { PredictionRecord } from '../types/prediction';

export function usePredictions() {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPredictions();
      setPredictions(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching predictions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { predictions, loading, error, refresh };
}
