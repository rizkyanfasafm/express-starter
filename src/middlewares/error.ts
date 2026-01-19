import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { badRequest, internalServerError } from '@/utils/response';
import { ERROR_CODES } from '@/constants/error-codes';
import { logger } from '@/utils/logger';
import { BadRequest } from '@/errors/bad-request';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const details: Record<string, string> = Object.fromEntries(
      err.issues.map((issue) => [issue.path.join('.'), issue.message])
    );
    return badRequest(res, ERROR_CODES.VALIDATION_ERROR, details);
  }

  if (err instanceof BadRequest) {
    return badRequest(res, err.message);
  }

  logger.error(err);

  return internalServerError(res);
}
