import request from './client';
import { ExpertBoardProject, POSyncProject } from '../types';

export const getExpertBoard = (params: { tren?: string; q?: string }) => {
  const query = new URLSearchParams({ ...(params.tren ? { tren: params.tren } : {}), ...(params.q ? { q: params.q } : {}) }).toString();
  return request<ExpertBoardProject[]>(`/boards/experts${query ? `?${query}` : ''}`);
};

export const postExpertDecision = (id: string, priorizado: 'SI' | 'NO' | '') =>
  request<ExpertBoardProject>(`/boards/experts/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ priorizado })
  });

export const getPOSyncBoard = (params: { tren?: string; q?: string; only_pri?: boolean }) => {
  const query = new URLSearchParams({
    ...(params.tren ? { tren: params.tren } : {}),
    ...(params.q ? { q: params.q } : {}),
    ...(params.only_pri !== undefined ? { only_pri: String(params.only_pri) } : {})
  }).toString();
  return request<POSyncProject[]>(`/boards/po-sync${query ? `?${query}` : ''}`);
};

export const postRating = (id: string, rating: number) =>
  request<POSyncProject>(`/boards/po-sync/${id}/rating`, {
    method: 'POST',
    body: JSON.stringify({ rating })
  });
