import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { respondCreated, respondError, respondOk } from '../utils/response';
import { refreshAccessToken, getUserProfile, loginUser, signupUser } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = await signupUser(req.body);
  if (!result) {
    return respondError(res, 400, { message: 'Email already exists' });
  }

  setRefreshCookie(res, result.refreshToken);
  return respondCreated(res, {
    accessToken: result.accessToken,
    user: result.user
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  if (!result) {
    return respondError(res, 401, { message: 'Invalid credentials' });
  }

  setRefreshCookie(res, result.refreshToken);
  return respondOk(res, {
    accessToken: result.accessToken,
    user: result.user
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = (req as any).cookies?.refreshToken;
  if (!token) {
    return respondError(res, 401, { message: 'No refresh token' });
  }

  try {
    const accessToken = await refreshAccessToken(token);
    return respondOk(res, { accessToken });
  } catch (error) {
    res.clearCookie('refreshToken');
    return respondError(res, 401, { message: 'Invalid refresh token' });
  }
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getUserProfile(req.user.id);
  return respondOk(res, user);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  return respondOk(res, { message: 'Logged out' });
});
