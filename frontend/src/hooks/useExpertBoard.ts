import { useState } from 'react';
import { getExpertBoard, postExpertDecision } from '../api/boards';
import { ExpertBoardProject } from '../types';

export const useExpertBoard = () => {
  const [projects, setProjects] = useState<ExpertBoardProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = async (tren?: string, q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpertBoard({ tren, q });
      setProjects(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveDecision = async (id: string, priorizado: 'SI' | 'NO' | '') => {
    const updated = await postExpertDecision(id, priorizado);
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated, prioritized: priorizado } : p)));
    return updated;
  };

  return { projects, loading, error, fetchBoard, saveDecision };
};
