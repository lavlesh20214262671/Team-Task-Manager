import { Router } from 'express';
import { protect, requireProjectRole } from '../middleware/auth';
import { getDashboardStats } from '../controllers/dashboard.controller';

const router = Router();

router.get(
  '/:projectId/stats',
  protect,
  requireProjectRole(['ADMIN', 'MEMBER']),
  getDashboardStats
);

export default router;