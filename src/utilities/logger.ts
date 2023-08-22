import pino, { LoggerOptions } from 'pino';

const pinoOptions: LoggerOptions = {
  level: process.env.PUBLIC_LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    censor: '--redacted--',
  },
};

export const logger = pino(pinoOptions);
