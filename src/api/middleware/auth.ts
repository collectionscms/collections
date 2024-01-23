import { getSession } from '@auth/express';
import { NextFunction, Request, Response } from 'express';
import { authConfig } from '../configs/auth.js';
import { UnauthorizedException } from '../../exceptions/unauthorized.js';

export const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  const session = res.locals.session ?? (await getSession(req, authConfig));
  if (!session) throw new UnauthorizedException();

  res.locals.session = session;
  return next();
};

export const currentSession = async (req: Request, res: Response, next: NextFunction) => {
  const session = await getSession(req, authConfig);
  res.locals.session = session;
  return next();
};
