import { useState, useEffect } from 'react';
import { getFeedback, postFeedback } from '../api/feedback';
import { FeedbackEntry } from '../types';

export const useFeedback = () => {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeedback();
      setEntries(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (usuario: string, texto: string) => {
    const created = await postFeedback({ usuario, texto });
    setEntries((prev) => [created, ...prev]);
    return created;
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return { entries, loading, error, fetchFeedback, submit };
};
