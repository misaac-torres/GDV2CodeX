export interface Dependency {
  id?: string;
  team: string; // célula / tren / CoE
  status: 'P' | 'L';
  description: string;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  q_rad: string;
  prioritized: 'SI' | 'NO' | '';
  owner: string;
  area: string;
  initiative: string;
  description: string;
  startDate: string;
  endDate: string;
  baseline: number;
  progress?: number;
  estimate?: number;
  dependencies: Dependency[];
}

export interface CreateProjectInput extends Omit<Project, 'id'> {}

export interface MetricsResponse {
  totalProjects: number;
  totalDependencies: number;
  totalL: number;
  totalP: number;
  coverage: number;
  avgProgress: number;
  avgProgressPri: number;
  avgProgressNoPri: number;
  prioritizedProjects: number;
  scope: 'all' | 'area' | 'celula';
  label?: string;
}

export interface ExpertBoardProject {
  id: string;
  q_rad: string;
  name: string;
  status: string;
  prioritized: 'SI' | 'NO' | '';
  contribution: string;
  initiative: string;
  total_dep: number;
  total_L: number;
  total_P: number;
  coverage: number;
  pendingDeps: Dependency[];
  negotiatedDeps: Dependency[];
}

export interface POSyncProject {
  id: string;
  q_rad: string;
  name: string;
  status: string;
  prioritized: 'SI' | 'NO' | '';
  rating_po: number;
  total_dep: number;
  total_L: number;
  total_P: number;
}

export interface FeedbackEntry {
  id: string;
  usuario: string;
  texto: string;
}
