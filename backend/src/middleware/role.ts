import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireGlobalRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.globalRole)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    return next();
  };
};
