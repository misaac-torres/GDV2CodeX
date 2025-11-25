import request from './client';
import { CreateProjectInput, Project } from '../types';

export const getProjects = () => request<Project[]>('/projects');

export const getProject = (id: string) => request<Project>(`/projects/${id}`);

export const createProject = (payload: CreateProjectInput) =>
  request<Project>('/projects', { method: 'POST', body: JSON.stringify(payload) });

export const updateProject = (id: string, payload: Partial<Project>) =>
  request<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
