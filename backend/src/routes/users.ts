import { Router } from 'express';
import prisma from '../config/db';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { respondOk } from '../utils/response';

const router = Router();

router.get(
	'/',
	protect,
	asyncHandler(async (_req, res) => {
		const users = await prisma.user.findMany({
			select: { id: true, name: true, email: true }
		});
		return respondOk(res, users);
	})
);

export default router;
