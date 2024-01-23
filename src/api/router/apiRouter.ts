import { ExpressAuth } from '@auth/express';
import express from 'express';
import { env } from '../../env.js';
import { expressLogger } from '../../utilities/expressLogger.js';
import { authConfig } from '../configs/auth.js';
import { files } from '../controllers/files.js';
import { me } from '../controllers/me.js';
import { project } from '../controllers/projects.js';
import { roles } from '../controllers/roles.js';
import { users } from '../controllers/users.js';
import { currentSession } from '../middleware/auth.js';
import { corsMiddleware } from '../middleware/cors.js';

const router = express.Router();

if (Boolean(env.CORS_ENABLED) === true) {
  router.use(corsMiddleware);
}

router.use(express.json({ limit: env.REQ_LIMIT }));
router.use(express.urlencoded({ limit: env.REQ_LIMIT, extended: true }));
router.use(expressLogger);
router.use(currentSession);
router.use('/auth/*', ExpressAuth(authConfig));

router.get('/health', (_req, res) => res.send('ok'));

router.use(users);
router.use(roles);
router.use(project);
router.use(me);
router.use(files);

export const apiRouter = router;
