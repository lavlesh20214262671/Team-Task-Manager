import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Not authorized'
        }
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as any;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token'
      }
    });
  }
};

export const requireProjectRole =
  (roles: string[]) =>
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const projectId = parseInt(
        req.params.projectId as string
      );

      const member =
        await prisma.projectMember.findFirst({
          where: {
            projectId,
            userId: req.user.id
          }
        });

      if (!member || !roles.includes(member.role)) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Access denied'
          }
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Authorization failed'
        }
      });
    }
  };