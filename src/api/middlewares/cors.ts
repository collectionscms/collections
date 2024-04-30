import cors from 'cors';
import { RequestHandler } from 'express';
import { env } from '../../env.js';

export let corsMiddleware: RequestHandler = (req, res, next) => next();

corsMiddleware = cors({
  origin: env.CORS_ORIGIN || true,
  methods: env.CORS_METHODS || 'GET,POST,PATCH,DELETE',
  allowedHeaders: env.CORS_ALLOWED_HEADERS,
  exposedHeaders: env.CORS_EXPOSED_HEADERS,
  credentials: env.CORS_CREDENTIALS || undefined,
  maxAge: env.CORS_MAX_AGE || undefined,
});
