import request from './client';
import { FeedbackEntry } from '../types';

export const getFeedback = (limit = 8) => request<FeedbackEntry[]>(`/feedback?limit=${limit}`);

export const postFeedback = (payload: { usuario: string; texto: string }) =>
  request<FeedbackEntry>('/feedback', { method: 'POST', body: JSON.stringify(payload) });
