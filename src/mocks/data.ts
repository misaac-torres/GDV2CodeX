import { Dependency, ExpertBoardProject, FeedbackEntry, POSyncProject, Project } from '../types';

export const dependencies: Dependency[] = [
  { id: 'd1', team: 'Analytics', status: 'P', description: 'Modelo de scoring' },
  { id: 'd2', team: 'Core BSS', status: 'L', description: 'Integración con CRM' },
  { id: 'd3', team: 'Seguridad', status: 'P', description: 'Revisión de controles' }
];

export const projects: Project[] = [
  {
    id: '1',
    name: 'Onboarding Digital',
    status: 'En curso',
    q_rad: 'Q3',
    prioritized: 'SI',
    owner: 'Ana Gómez',
    area: 'Digital',
    initiative: 'Crecimiento digital',
    description: 'Mejorar onboarding web',
    startDate: '2024-07-01',
    endDate: '2024-10-30',
    baseline: 0.5,
    progress: 0.35,
    estimate: 0.6,
    dependencies
  },
  {
    id: '2',
    name: 'Migración BSS',
    status: 'Nuevo',
    q_rad: 'Q4',
    prioritized: 'NO',
    owner: 'Carlos Pérez',
    area: 'Core',
    initiative: 'Eficiencia operativa',
    description: 'Migrar módulos BSS a cloud',
    startDate: '2024-09-01',
    endDate: '2025-02-28',
    baseline: 0.4,
    progress: 0.1,
    estimate: 0.3,
    dependencies: [dependencies[1]]
  }
];

export const expertProjects: ExpertBoardProject[] = [
  {
    id: '1',
    q_rad: 'Q3',
    name: 'Onboarding Digital',
    status: 'En curso',
    prioritized: 'SI',
    contribution: 'Ingresos digitales',
    initiative: 'Crecimiento digital',
    total_dep: 3,
    total_L: 1,
    total_P: 2,
    coverage: 66,
    pendingDeps: dependencies.filter((d) => d.status === 'P'),
    negotiatedDeps: dependencies.filter((d) => d.status === 'L')
  },
  {
    id: '2',
    q_rad: 'Q4',
    name: 'Migración BSS',
    status: 'Nuevo',
    prioritized: '',
    contribution: 'Eficiencia',
    initiative: 'Eficiencia operativa',
    total_dep: 1,
    total_L: 1,
    total_P: 0,
    coverage: 0,
    pendingDeps: [],
    negotiatedDeps: [dependencies[1]]
  }
];

export const poProjects: POSyncProject[] = [
  { id: '1', q_rad: 'Q3', name: 'Onboarding Digital', status: 'En curso', prioritized: 'SI', rating_po: 4, total_dep: 3, total_L: 1, total_P: 2 },
  { id: '2', q_rad: 'Q4', name: 'Migración BSS', status: 'Nuevo', prioritized: 'NO', rating_po: 0, total_dep: 1, total_L: 1, total_P: 0 }
];

export const feedbackEntries: FeedbackEntry[] = [
  { id: 'f1', usuario: 'Lucía', texto: 'Agregar filtro por tren en métricas.' },
  { id: 'f2', usuario: 'Juan', texto: 'Excelente visualización de dependencias.' }
];
