import express from 'express';
import { post } from './public/v1/post.router.js';

export const tenantPublicApiRouter = express.Router();

tenantPublicApiRouter.use(post);
