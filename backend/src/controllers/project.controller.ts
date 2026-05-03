import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { respondCreated, respondError, respondOk } from '../utils/response';
import {
  addProjectMember,
  createProject,
  listUserProjects,
  removeProjectMember
} from '../services/project.service';
import { AuthRequest } from '../middleware/auth';
import { Server } from 'socket.io';

export const createProjectController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const project = await createProject(req.user.id, req.body);
    return respondCreated(res, project);
  }
);

export const listProjectsController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projects = await listUserProjects(req.user.id);
    return respondOk(res, projects);
  }
);

export const addMemberController = (io: Server) =>
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId as string);
    const member = await addProjectMember(projectId, req.body);

    if (!member) {
      return respondError(res, 404, { message: 'User not found' });
    }

    io.to(`project:${projectId}`).emit('project:member-added', member);
    return respondCreated(res, member);
  });

export const removeMemberController = (io: Server) =>
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const projectId = parseInt(req.params.projectId as string);
    const userIdToRemove = parseInt(req.params.userId as string);

    if (req.user.id === userIdToRemove) {
      return respondError(res, 400, { message: 'Cannot remove yourself' });
    }

    await removeProjectMember(projectId, userIdToRemove);

    io.to(`project:${projectId}`).emit('project:member-removed', {
      userId: userIdToRemove
    });

    return respondOk(res, { message: 'Member removed' });
  });
