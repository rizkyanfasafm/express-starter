import { ErrorCodeValue } from '@/constants/error-codes';

export class AppError extends Error {
  constructor(public errorCode: ErrorCodeValue) {
    super(errorCode.message);
  }
}
