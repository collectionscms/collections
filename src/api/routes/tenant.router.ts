import express from 'express';
import { apiKey } from './apiKey.router.js';
import { content } from './content.router.js';
import { file } from './file.router.js';
import { invitation } from './invitation.router.js';
import { me } from './me.router.js';
import { post } from './post.router.js';
import { project } from './project.router.js';
import { review } from './review.router.js';
import { role } from './role.router.js';
import { trashedContent } from './trashedContent.router.js';
import { user } from './user.router.js';

export const tenantApiRouter = express.Router();

tenantApiRouter.get('/health', (_req, res) => res.send('tenant ok'));
tenantApiRouter.use(user);
tenantApiRouter.use(role);
tenantApiRouter.use(project);
tenantApiRouter.use(me);
tenantApiRouter.use(file);
tenantApiRouter.use(post);
tenantApiRouter.use(trashedContent);
tenantApiRouter.use(content);
tenantApiRouter.use(invitation);
tenantApiRouter.use(review);
tenantApiRouter.use(apiKey);
