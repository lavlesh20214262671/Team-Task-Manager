import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { respondOk } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { getProjectStats } from '../services/dashboard.service';

export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projectId = parseInt(req.params.projectId as string);
    const stats = await getProjectStats(projectId);
    return respondOk(res, stats);
  }
);
