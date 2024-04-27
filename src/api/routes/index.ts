import { ExpressAuth } from '@auth/express';
import express from 'express';
import { env } from '../../env.js';
import { expressLogger } from '../../utilities/expressLogger.js';
import { authConfig } from '../configs/auth.js';
import { currentSession } from '../middlewares/auth.js';
import { corsMiddleware } from '../middlewares/cors.js';
import { content } from './content.router.js';
import { file } from './file.router.js';
import { me } from './me.router.js';
import { post } from './post.router.js';
import { project } from './project.router.js';
import { role } from './role.router.js';
import { user } from './user.router.js';

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
router.use(post);
router.use(content);
