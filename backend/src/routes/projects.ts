import express from 'express';
import { protect, requireProjectRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Server } from 'socket.io';
import {
  addMemberController,
  createProjectController,
  listProjectsController,
  removeMemberController
} from '../controllers/project.controller';
import {
  addProjectMemberSchema,
  createProjectSchema
} from '../utils/validators';

const router = (io: Server) => {
  const r = express.Router();

  r.post(
    '/',
    protect as any,
    validate(createProjectSchema),
    createProjectController
  );

  r.get('/', protect as any, listProjectsController);

  r.post(
    '/:projectId/members',
    protect as any,
    requireProjectRole(['ADMIN']) as any,
    validate(addProjectMemberSchema),
    addMemberController(io)
  );

  r.delete(
    '/:projectId/members/:userId',
    protect as any,
    requireProjectRole(['ADMIN']) as any,
    removeMemberController(io)
  );

  return r;
};

export default router;