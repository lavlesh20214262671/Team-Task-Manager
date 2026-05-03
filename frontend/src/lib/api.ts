const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiFetch = async (path: string, options?: RequestInit) => {
  const token = localStorage.getItem('ttm_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {})
  };

  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });

  return response.json();
};
