import Hooks from '@shared/features/hooks';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import authentications from '../controllers/authentications';
import collections from '../controllers/collections';
import contents from '../controllers/contents';
import fields from '../controllers/fields';
import projectSettings from '../controllers/projectSettings';
import roles from '../controllers/roles';
import users from '../controllers/users';
import authHandler from '../middleware/authHandler';
import errorHandler from '../middleware/errorHandler';
import extractTokenHandler from '../middleware/extractTokenHandler';
import { expressLogger } from '../../utilities/logger';

Hooks.addAction(
  'api/init',
  async (app: Express) => {
    app.use((req, res, next) => {
      const origin = req.get('origin');
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Headers', 'content-type, auth-token');
      res.header('Access-Control-Expose-Headers', 'content-type, auth-token');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
      next();
    });

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
