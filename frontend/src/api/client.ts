const isTest = typeof process !== 'undefined' && process.env.VITEST;

const API_BASE =
  import.meta.env.VITE_API_BASE ?? (isTest ? '' : import.meta.env.DEV ? 'http://localhost:8000' : '');

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error de comunicación con el servicio');
  }

  return response.json() as Promise<T>;
}

export default request;
