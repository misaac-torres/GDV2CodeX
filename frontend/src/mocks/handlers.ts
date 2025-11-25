import { http, HttpResponse } from 'msw';
import { expertProjects, feedbackEntries, poProjects, projects } from './data';
import { CreateProjectInput } from '../types';

export const handlers = [
  http.get('/projects', () => HttpResponse.json(projects)),
  http.get('/projects/:id', ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
    return project ? HttpResponse.json(project) : HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),
  http.post('/projects', async ({ request }) => {
    const body = (await request.json()) as CreateProjectInput;
    const newProject = { ...body, id: String(projects.length + 1) };
    projects.push(newProject);
    return HttpResponse.json(newProject, { status: 201 });
  }),
  http.patch('/projects/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<CreateProjectInput>;
    const idx = projects.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    projects[idx] = { ...projects[idx], ...body } as any;
    return HttpResponse.json(projects[idx]);
  }),

  http.get('/metrics', ({ request }) => {
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'all';
    const label = url.searchParams.get('filter') ?? undefined;
    const totalDeps = projects.reduce((acc, p) => acc + p.dependencies.length, 0);
    const totalL = projects.reduce((acc, p) => acc + p.dependencies.filter((d) => d.status === 'L').length, 0);
    const totalP = totalDeps - totalL;
    return HttpResponse.json({
      totalProjects: projects.length,
      totalDependencies: totalDeps,
      totalL,
      totalP,
      coverage: totalDeps === 0 ? 0 : Math.round((totalP / totalDeps) * 100),
      avgProgress: Number((projects.reduce((acc, p) => acc + (p.progress ?? 0), 0) / projects.length).toFixed(2)),
      avgProgressPri: 0.55,
      avgProgressNoPri: 0.25,
      prioritizedProjects: projects.filter((p) => p.prioritized === 'SI').length,
      scope,
      label
    });
  }),

  http.get('/boards/experts', () => HttpResponse.json(expertProjects)),
  http.post('/boards/experts/:id/decision', async ({ params, request }) => {
    const { priorizado } = (await request.json()) as { priorizado: 'SI' | 'NO' | '' };
    const idx = expertProjects.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    expertProjects[idx].prioritized = priorizado;
    return HttpResponse.json(expertProjects[idx]);
  }),

  http.get('/boards/po-sync', () => HttpResponse.json(poProjects)),
  http.post('/boards/po-sync/:id/rating', async ({ params, request }) => {
    const { rating } = (await request.json()) as { rating: number };
    const idx = poProjects.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    poProjects[idx].rating_po = rating;
    return HttpResponse.json(poProjects[idx]);
  }),

  http.get('/feedback', () => HttpResponse.json(feedbackEntries)),
  http.post('/feedback', async ({ request }) => {
    const body = (await request.json()) as { usuario: string; texto: string };
    const created = { id: `f${feedbackEntries.length + 1}`, ...body };
    feedbackEntries.unshift(created);
    return HttpResponse.json(created, { status: 201 });
  })
];
