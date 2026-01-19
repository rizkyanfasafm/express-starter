import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { errorHandler } from '@/middlewares/error';
import { routes } from '@/routes';
import { logger } from '@/utils/logger';

export function createApp() {
  const app = express();

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', routes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Not Found' });
  });

  app.use(errorHandler);

  return app;
}
