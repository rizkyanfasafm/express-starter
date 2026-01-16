import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: z.ZodSchema, target: ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (err) {
      next(err);
    }
  };
};
