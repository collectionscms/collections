import { ExpressAuth } from '@auth/express';
import express from 'express';
import { env } from '../../env.js';
import { expressLogger } from '../../utilities/expressLogger.js';
import { authConfig } from '../configs/auth.js';
import { file } from './file.js';
import { me } from './me.js';
import { project } from './project.js';
import { role } from './role.js';
import { user } from './user.js';
import { currentSession } from '../middleware/auth.js';
import { corsMiddleware } from '../middleware/cors.js';

export const router = express.Router();

if (Boolean(env.CORS_ENABLED) === true) {
  router.use(corsMiddleware);
}

router.use(express.json({ limit: env.REQ_LIMIT }));
router.use(express.urlencoded({ limit: env.REQ_LIMIT, extended: true }));
router.use(expressLogger);
router.use(currentSession);
router.use('/auth/*', ExpressAuth(authConfig));

router.get('/health', (_req, res) => res.send('ok'));

router.use(user);
router.use(role);
router.use(project);
router.use(me);
router.use(file);
