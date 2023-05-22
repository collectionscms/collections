import cookieParser from 'cookie-parser';
import express from 'express';
import { env } from '../../env.js';
import { expressLogger } from '../../utilities/logger.js';
import { authentications } from '../controllers/authentications.js';
import { collections } from '../controllers/collections.js';
import { contents } from '../controllers/contents.js';
import { fields } from '../controllers/fields.js';
import { files } from '../controllers/files.js';
import { projectSettings } from '../controllers/projectSettings.js';
import { relations } from '../controllers/relations.js';
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
router.use(collections);
router.use(fields);
router.use(contents);
router.use(projectSettings);
router.use(authentications);
router.use(files);
router.use(relations);

export const apiRouter = router;
