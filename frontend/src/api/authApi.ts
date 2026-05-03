import { apiFetch } from '../lib/api';
export const login = (payload: { email: string; password: string }) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
export const signup = (payload: { name: string; email: string; password: string }) =>
  apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
export const getMe = () => apiFetch('/auth/me');
