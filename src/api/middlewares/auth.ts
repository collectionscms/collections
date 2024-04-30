import { getSession } from '@auth/express';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../../exceptions/unauthorized.js';
import { authConfig } from '../configs/auth.js';

export const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.user ?? (await getSession(req, authConfig));
  if (!user) throw new UnauthorizedException();

  res.user = user;
  return next();
};

export const currentSession = async (req: Request, res: Response, next: NextFunction) => {
  const session = await getSession(req, authConfig);
  if (session?.user) {
    res.user = session?.user;
  }
  return next();
};
