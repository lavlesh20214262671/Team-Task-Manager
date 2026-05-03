import { apiFetch } from '../lib/api';
export const getDashboardStats = (projectId: number) => apiFetch(`/dashboard/${projectId}/stats`);
export const getUsers = () => apiFetch('/users');
