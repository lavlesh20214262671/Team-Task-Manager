import { apiFetch } from '../lib/api';
export const getProjects = () => apiFetch('/projects');
export const createProject = (data: { name: string; description?: string }) =>
  apiFetch('/projects', { method: 'POST', body: JSON.stringify(data) });
export const addMember = (projectId: number, data: { email: string; role?: string }) =>
  apiFetch(`/projects/${projectId}/members`, { method: 'POST', body: JSON.stringify(data) });
export const removeMember = (projectId: number, userId: number) =>
  apiFetch(`/projects/${projectId}/members/${userId}`, { method: 'DELETE' });
