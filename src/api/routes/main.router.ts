import { ExpressAuth } from '@auth/express';
import express from 'express';
import { authConfig } from '../configs/auth.js';
import { me } from './me.router.js';

export const mainApiRouter = express.Router();

mainApiRouter.get('/health', (_req, res) => res.send('app ok'));
mainApiRouter.use('/auth/*', ExpressAuth(authConfig));
mainApiRouter.use(me);
