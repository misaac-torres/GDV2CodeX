import { useEffect, useState, useCallback } from 'react';
import { createProject, getProject, getProjects, updateProject } from '../api/projects';
import { CreateProjectInput, Project } from '../types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (payload: CreateProjectInput) => {
    const project = await createProject(payload);
    setProjects((prev) => [...prev, project]);
    return project;
  };

  const update = async (id: string, payload: Partial<Project>) => {
    const updated = await updateProject(id, payload);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const getById = async (id: string) => getProject(id);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, fetchProjects, create, update, getById };
};
