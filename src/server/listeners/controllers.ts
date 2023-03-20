import Hooks from '@shared/features/hooks';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { env } from 'process';
import { expressLogger } from '../../utilities/logger';
import authentications from '../controllers/authentications';
import collections from '../controllers/collections';
import contents from '../controllers/contents';
import fields from '../controllers/fields';
import projectSettings from '../controllers/projectSettings';
import roles from '../controllers/roles';
import users from '../controllers/users';
import authHandler from '../middleware/authHandler';
import cors from '../middleware/cors';
import errorHandler from '../middleware/errorHandler';
import extractTokenHandler from '../middleware/extractTokenHandler';

Hooks.addAction(
  'api/init',
  async (app: Express) => {
    if (Boolean(env.CORS_ENABLED) === true) {
      app.use(cors);
    }

    app.use(cookieParser(process.env.SIGNED_COOKIE));
    app.use(express.json({ limit: process.env.REQ_LIMIT }));
    app.use(express.urlencoded({ limit: process.env.REQ_LIMIT, extended: true }));
    app.use(expressLogger);

    app.use(extractTokenHandler);
    app.use(authHandler);

    app.use(users);
    app.use(roles);
    app.use(collections);
    app.use(fields);
    app.use(contents);
    app.use(projectSettings);
    app.use(authentications);

    app.use(errorHandler);
  },
  { id: 'core/controllers' }
);
