import { ExpressAuth } from '@auth/express';
import express from 'express';
import { authConfig } from '../configs/auth.js';
import { auth } from './auth.router.js';
import { invitation } from './invitation.router.js';
import { me } from './me.router.js';

export const portalApiRouter = express.Router();

portalApiRouter.get('/health', (_req, res) => res.send('app ok'));
portalApiRouter.use(auth);
portalApiRouter.use('/auth/*', ExpressAuth(authConfig));
portalApiRouter.use(me);
portalApiRouter.use(invitation);
