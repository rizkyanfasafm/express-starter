import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { error } from '@/utils/response';
import { ERROR_CODES } from '@/constants/error-codes';
import { logger } from '@/utils/logger';
import { AppError } from '@/errors/app-error';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const { status, code, message } = ERROR_CODES.VALIDATION_ERROR;
    const details = Object.fromEntries(
      err.issues.map((issue) => [issue.path.join('.'), issue.message])
    );
    return error(res, { status, message, code, errors: details });
  }

  if (err instanceof AppError) {
    const { status, code, message } = err.errorCode;
    return error(res, { status, code, message });
  }

  logger.error(err);

  const { status, code, message } = ERROR_CODES.INTERNAL_ERROR;
  return error(res, { status, code, message });
}
