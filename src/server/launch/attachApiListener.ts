import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { env } from '../../env.js';
import { expressLogger } from '../../utilities/logger.js';
import { authentications } from '../controllers/authentications.js';
import { collections } from '../controllers/collections.js';
import { contents } from '../controllers/contents.js';
import { fields } from '../controllers/fields.js';
import { files } from '../controllers/files.js';
import { projectSettings } from '../controllers/projectSettings.js';
import { roles } from '../controllers/roles.js';
import { users } from '../controllers/users.js';
import { authHandler } from '../middleware/authHandler.js';
import { corsMiddleware } from '../middleware/cors.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { extractTokenHandler } from '../middleware/extractTokenHandler.js';

export const attachApiListener = async (app: Express) => {
  if (Boolean(env.CORS_ENABLED) === true) {
    app.use(corsMiddleware);
  }

  app.use(cookieParser());
  app.use(express.json({ limit: env.REQ_LIMIT }));
  app.use(express.urlencoded({ limit: env.REQ_LIMIT, extended: true }));
  app.use(expressLogger);

  app.use(extractTokenHandler);
  app.use(authHandler);

  app.get('/health', (req, res) => res.send('ok'));

  app.use(users);
  app.use(roles);
  app.use(collections);
  app.use(fields);
  app.use(contents);
  app.use(projectSettings);
  app.use(authentications);
  app.use(files);

  app.use(errorHandler);
};
