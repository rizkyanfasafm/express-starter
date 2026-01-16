import { NextFunction, Request, Response } from 'express';
import { unauthorized } from '@/utils/response';
import { verifyAccessToken } from '@/utils/jwt';

export interface AuthRequest extends Request {
  userId?: number;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return unauthorized(res);

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.id;
    next();
  } catch (_err) {
    return unauthorized(res);
  }
};
