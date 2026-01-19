import { Response } from 'express';

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiError<T> = {
  success: false;
  code?: string;
  message: string;
  errors?: T;
};

type SuccessOptions<T> = {
  status: number;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

type ErrorOptions<T> = {
  status: number;
  code?: string;
  message: string;
  errors?: T;
};

export function success<T>(
  res: Response,
  { status = 200, message = 'OK', data, meta }: SuccessOptions<T>
): Response<ApiSuccess<T>> {
  return res.status(status).json({ success: true, message, data, meta });
}

export function error<T>(
  res: Response,
  { status = 400, code, message, errors }: ErrorOptions<T>
): Response<ApiError<T>> {
  return res.status(status).json({
    success: false,
    ...(code && { code }),
    message,
    errors,
  });
}

// Common error helpers
export const badRequest = <T>(res: Response, message?: string, errors?: T) =>
  error(res, { status: 400, message: message || 'Bad Request', errors });

export const unauthorized = (res: Response, message?: string) =>
  error(res, { status: 401, message: message || 'Unauthorized' });

export const forbidden = (res: Response, message?: string) =>
  error(res, { status: 403, message: message || 'Forbidden' });

export const notFound = (res: Response, message?: string) =>
  error(res, { status: 404, message: message || 'Not Found' });

export const conflict = (res: Response, message?: string) =>
  error(res, { status: 409, message: message || 'Conflict' });

export const internalServerError = (res: Response, message?: string) =>
  error(res, { status: 500, message: message || 'Internal server error' });

export const ok = <T>(res: Response, data?: T, message?: string, meta?: Record<string, unknown>) =>
  success(res, { status: 200, message: message || 'OK', data, meta });

export const created = <T>(
  res: Response,
  data?: T,
  message?: string,
  meta?: Record<string, unknown>
) => success(res, { status: 201, message: message || 'Created', data, meta });
