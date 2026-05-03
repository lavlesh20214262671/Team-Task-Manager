import { apiFetch } from '../lib/api';
export const getTasks = (projectId: number) => apiFetch(`/projects/${projectId}/tasks`);
export const createTask = (projectId: number, data: object) =>
  apiFetch(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(data) });
export const updateTask = (projectId: number, taskId: number, data: object) =>
  apiFetch(`/projects/${projectId}/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(data) });
