import { Router } from 'express';
import { protect, requireProjectRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Server } from 'socket.io';
import {
  createTaskController,
  listTasksController,
  updateTaskController
} from '../controllers/task.controller';
import { createTaskSchema, updateTaskSchema } from '../utils/validators';

const router = (io: Server) => {
  const r = Router();

  r.post(
    '/:projectId/tasks',
    protect,
    requireProjectRole(['ADMIN']),
    validate(createTaskSchema),
    createTaskController(io)
  );

  r.get(
    '/:projectId/tasks',
    protect,
    requireProjectRole(['ADMIN', 'MEMBER']),
    listTasksController
  );

  r.patch(
    '/:projectId/tasks/:taskId',
    protect,
    requireProjectRole(['ADMIN', 'MEMBER']),
    validate(updateTaskSchema),
    updateTaskController(io)
  );

  return r;
};

export default router;