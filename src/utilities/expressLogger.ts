import { Request, RequestHandler } from 'express';
import pino, { LoggerOptions } from 'pino';
import { pinoHttp, stdSerializers } from 'pino-http';

const httpLoggerOptions: LoggerOptions = {
  level: process.env.PUBLIC_LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    censor: '--redacted--',
  },
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'hostname,pid',
      hideObject: process.env.PUBLIC_LOG_HIDE_OBJECT || true,
      sync: true,
      translateTime: 'SYS:HH:MM:ss',
      messageFormat: '{req.method} {req.url} {res.statusCode} {responseTime}ms',
    },
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

export const expressLogger = pinoHttp({
  logger: pino(httpLoggerOptions),
  serializers: {
    req(request: Request) {
      const output = stdSerializers.req(request);
      output.url = redactQuery(output.url);
      return output;
    },
  },
}) as RequestHandler;
