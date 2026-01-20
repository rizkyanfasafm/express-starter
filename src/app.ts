import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { errorHandler } from '@/middlewares/error';
import { routes } from '@/routes';
import { logger } from '@/utils/logger';
import { env } from '@/env';
import {notFound} from "@/utils/response";

export function createApp() {
  const app = express();

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
    })
  );
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', routes);

  app.use((_req, res) => {
    notFound(res)
  });

  app.use(errorHandler);

  return app;
}
