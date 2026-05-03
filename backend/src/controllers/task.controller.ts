import { Response } from 'express';
import { Server } from 'socket.io';
import { asyncHandler } from '../utils/asyncHandler';
import { respondCreated, respondError, respondOk } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import {
  createTask,
  getProjectMemberRole,
  getTaskById,
  listProjectTasks,
  updateTask
} from '../services/task.service';

export const createTaskController = (io: Server) =>
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const projectId = parseInt(req.params.projectId as string);
    const task = await createTask(projectId, req.user.id, req.body);
    io.to(`project:${projectId}`).emit('task:created', task);
    return respondCreated(res, task);
  });

export const listTasksController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projectId = parseInt(req.params.projectId as string);
    const memberRecord = await getProjectMemberRole(projectId, req.user.id);
    if (!memberRecord) {
      return respondError(res, 403, { message: 'Access denied' });
    }

    const tasks = await listProjectTasks(projectId);
    return respondOk(res, tasks);
  }
);

export const updateTaskController = (io: Server) =>
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const projectId = parseInt(req.params.projectId as string);
    const taskId = parseInt(req.params.taskId as string);

    const task = await getTaskById(projectId, taskId);
    if (!task) {
      return respondError(res, 404, { message: 'Task not found' });
    }

    const memberRecord = await getProjectMemberRole(projectId, req.user.id);
    if (memberRecord?.role === 'MEMBER') {
      if (task.assigneeId !== req.user.id) {
        return respondError(res, 403, {
          message: 'Can only update your own tasks'
        });
      }

      const allowedKeys = ['status'];
      const requestedKeys = Object.keys(req.body);
      if (!requestedKeys.every((k) => allowedKeys.includes(k))) {
        return respondError(res, 403, {
          message: 'Members can only update task status'
        });
      }
    }

    const updatedTask = await updateTask(taskId, req.body);
    io.to(`project:${projectId}`).emit('task:updated', updatedTask);
    return respondOk(res, updatedTask);
  });
