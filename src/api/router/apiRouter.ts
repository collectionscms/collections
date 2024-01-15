import cookieParser from 'cookie-parser';
import express from 'express';
import { env } from '../../env.js';
import { expressLogger } from '../../utilities/expressLogger.js';
import { authentications } from '../controllers/authentications.js';
import { files } from '../controllers/files.js';
import { me } from '../controllers/me.js';
import { project } from '../controllers/projects.js';
import { roles } from '../controllers/roles.js';
import { users } from '../controllers/users.js';
import { authHandler } from '../middleware/authHandler.js';
import { corsMiddleware } from '../middleware/cors.js';
import { extractTokenHandler } from '../middleware/extractTokenHandler.js';

const router = express.Router();

if (Boolean(env.CORS_ENABLED) === true) {
  router.use(corsMiddleware);
}

router.use(cookieParser());
router.use(express.json({ limit: env.REQ_LIMIT }));
router.use(express.urlencoded({ limit: env.REQ_LIMIT, extended: true }));
router.use(expressLogger);

router.use(extractTokenHandler);
router.use(authHandler);

router.get('/health', (_req, res) => res.send('ok'));

router.use(users);
router.use(roles);
router.use(project);
router.use(authentications);
router.use(me);
router.use(files);

export const apiRouter = router;
