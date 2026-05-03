import express from 'express';
import { validate } from '../middleware/validate';
import { protect } from '../middleware/auth';
import { loginSchema, signupSchema } from '../utils/validators';
import {
  login,
  logout,
  me,
  refresh,
  signup
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.get('/me', protect, me);
router.post('/logout', logout);

export default router;