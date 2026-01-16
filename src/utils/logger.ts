import pino from 'pino';
import { env } from '@/env';

const targets: pino.TransportTargetOptions[] = [
  {
    target: env.NODE_ENV !== 'production' ? 'pino-pretty' : 'pino/file',
    options: env.NODE_ENV !== 'production' ? {} : { destination: 1 },
    level: 'info',
  },
  {
    target: 'pino/file',
    options: { destination: 'logs/app.log', mkdir: true },
    level: 'info',
  },
];

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: { targets },
});
