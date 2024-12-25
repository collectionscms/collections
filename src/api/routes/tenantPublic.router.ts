import express from 'express';
import { content } from './public/v1/content.router.js';
import { post } from './public/v1/post.router.js';
import { tag } from './public/v1/tag.router.js';

export const tenantPublicApiRouter = express.Router();

tenantPublicApiRouter.use(post);
tenantPublicApiRouter.use(content);
tenantPublicApiRouter.use(tag);
