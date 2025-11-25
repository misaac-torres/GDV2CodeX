import { useState } from 'react';
import { getMetrics } from '../api/metrics';
import { MetricsResponse } from '../types';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (scope: 'all' | 'area' | 'celula', filter?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMetrics({ scope, filter });
      setMetrics(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, fetchMetrics };
};
