import { ExpressAuth } from '@auth/express';
import express from 'express';
import { authConfig } from '../configs/auth.js';
import { me } from './me.router.js';

export const portalApiRouter = express.Router();

portalApiRouter.get('/health', (_req, res) => res.send('app ok'));
portalApiRouter.use('/auth/*', ExpressAuth(authConfig));
portalApiRouter.use(me);
