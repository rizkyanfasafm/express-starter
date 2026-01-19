import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.url(),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().optional(),
  DATABASE_HOST: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  DATABASE_PORT: z.coerce.number().default(3306),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_REFRESH_EXPIRES_IN: z.string(),
});

export const env = EnvSchema.parse(process.env);
