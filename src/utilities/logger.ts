import { Request, RequestHandler } from 'express';
import * as Pino from 'pino';
import PinoHTTP from 'pino-http';
import { env } from '../env.js';

const pinoOptions: Pino.LoggerOptions = {
  level: env.LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    censor: '--redacted--',
  },
};

const httpLoggerOptions: Pino.LoggerOptions = {
  level: env.LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    censor: '--redacted--',
  },
};

const redactQuery = (originalPath: string) => {
  const url = new URL(originalPath, 'http://example.com/');

  // Access token contained in request parameters.
  if (url.searchParams.has('access_token')) {
    url.searchParams.set('access_token', '--redacted--');
  }

  return url.pathname + url.search;
};

export const expressLogger = PinoHTTP.pinoHttp({
  logger: Pino.pino(httpLoggerOptions),
  serializers: {
    req(request: Request) {
      const output = Pino.stdSerializers.req(request);
      output.url = redactQuery(output.url);
      return output;
    },
  },
}) as RequestHandler;

export const logger = Pino.pino(pinoOptions);
