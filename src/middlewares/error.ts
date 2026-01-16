import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { badRequest, internalServerError } from '@/utils/response';
import { ERROR_CODES } from '@/constants/error-codes';
import { env } from '@/env';
import { logger } from '@/utils/logger';
import {BadRequest} from "@/errors/bad-request";

const errorMap: Record<string, { status: number; message: string }> = {
  [ERROR_CODES.INVALID_CREDENTIALS]: { status: 401, message: 'Invalid credentials' },
  [ERROR_CODES.UNAUTHORIZED]: { status: 401, message: 'Unauthorized' },
  [ERROR_CODES.FORBIDDEN]: { status: 403, message: 'Forbidden' },
  [ERROR_CODES.NOT_FOUND]: { status: 404, message: 'Not found' },
  [ERROR_CODES.CONFLICT]: { status: 409, message: 'Resource already exists' },
};

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const details : Record<string, string> = Object.fromEntries(
      err.issues.map((issue) => [issue.path.join('.'), issue.message])
    );
    return badRequest(res, ERROR_CODES.VALIDATION_ERROR,  details);
  }

  if (err instanceof BadRequest){
    return badRequest(res, err.message)
  }

  logger.error(err);

  console.log(err);

  return internalServerError(res);
}
