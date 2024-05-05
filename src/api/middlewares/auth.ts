import { getSession } from '@auth/express';
import { NextFunction, Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { UnauthorizedException } from '../../exceptions/unauthorized.js';
import { authConfig } from '../configs/auth.js';

export const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.user || (await getSession(req, authConfig))?.user;
  if (!user) return next(new UnauthorizedException());

  const subdomain = req.subdomains[0];
  if (subdomain) {
    const project = user.projects.find((project) => project.subdomain === subdomain);
    if (!project) {
      return next(new RecordNotFoundException('record_not_found'));
    }
    res.tenantProjectId = project?.id;
  }

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
