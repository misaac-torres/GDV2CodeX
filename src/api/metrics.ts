import request from './client';
import { MetricsResponse } from '../types';

export const getMetrics = (params: { scope: string; filter?: string }) => {
  const query = new URLSearchParams(params).toString();
  return request<MetricsResponse>(`/metrics?${query}`);
};
