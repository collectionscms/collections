import { Request, RequestHandler } from 'express';
import pino, { LoggerOptions } from 'pino';
import pinoHTTP, { stdSerializers } from 'pino-http';

const pinoOptions: LoggerOptions = {
  level: process.env.PUBLIC_LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    censor: '--redacted--',
  },
};
const httpLoggerOptions: LoggerOptions = {
  level: process.env.PUBLIC_LOG_LEVEL || 'info',
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

export const expressLogger = pinoHTTP({
  logger: pino(httpLoggerOptions),
  serializers: {
    req(request: Request) {
      const output = stdSerializers.req(request);
      output.url = redactQuery(output.url);
      return output;
    },
  },
}) as RequestHandler;

export const logger = pino(pinoOptions);
