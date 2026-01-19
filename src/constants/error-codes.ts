export const ERROR_CODES = {
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400, message: 'Validation failed' },
  INVALID_CREDENTIALS: { code: 'INVALID_CREDENTIALS', status: 401, message: 'Invalid credentials' },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401, message: 'Unauthorized' },
  FORBIDDEN: { code: 'FORBIDDEN', status: 403, message: 'Forbidden' },
  NOT_FOUND: { code: 'NOT_FOUND', status: 404, message: 'Not found' },
  CONFLICT: { code: 'CONFLICT', status: 409, message: 'Conflict' },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500, message: 'Internal server error' },
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODES;
export type ErrorCodeValue = (typeof ERROR_CODES)[ErrorCodeKey];
