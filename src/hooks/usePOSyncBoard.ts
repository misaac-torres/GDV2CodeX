import { useState } from 'react';
import { getPOSyncBoard, postRating } from '../api/boards';
import { POSyncProject } from '../types';

export const usePOSyncBoard = () => {
  const [projects, setProjects] = useState<POSyncProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = async (tren?: string, q?: string, onlyPri?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPOSyncBoard({ tren, q, only_pri: onlyPri });
      setProjects(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveRating = async (id: string, rating: number) => {
    const updated = await postRating(id, rating);
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, rating_po: rating } : p)));
    return updated;
  };

  return { projects, loading, error, fetchBoard, saveRating };
};
