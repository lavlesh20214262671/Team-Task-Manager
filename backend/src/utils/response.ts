import { Response } from 'express';

type ErrorDetails = {
  message: string;
  details?: unknown;
};

export const respondOk = <T>(res: Response, data: T, message?: string) => {
  return res.json({
    success: true,
    data,
    message
  });
};

export const respondCreated = <T>(res: Response, data: T, message?: string) => {
  return res.status(201).json({
    success: true,
    data,
    message
  });
};

export const respondError = (res: Response, status: number, error: ErrorDetails) => {
  return res.status(status).json({
    success: false,
    error
  });
};
