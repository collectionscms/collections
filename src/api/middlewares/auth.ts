import { getSession } from '@auth/express';
import { NextFunction, Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { UnauthorizedException } from '../../exceptions/unauthorized.js';
import { authConfig } from '../configs/auth.js';
import { UserRepository } from '../data/user/user.repository.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { GetMyProjectRolesUseCase } from '../useCases/me/getMyProjectRoles.useCase.js';

export const currentSession = async (req: Request, res: Response, next: NextFunction) => {
  const session = await getSession(req, authConfig);
  if (session?.user) {
    res.user = session?.user;
  }
  return next();
};

export const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  const sessionUser = res.user;
  if (!sessionUser) return next(new UnauthorizedException());

  const useCase = new GetMyProjectRolesUseCase(bypassPrisma, new UserRepository());
  const { projects } = await useCase.execute(sessionUser.id);
  res.projects = projects;

  // Check has project role
  const subdomain = req.subdomains[0];
  if (subdomain) {
    const projectRole = projects[subdomain];

    if (!projectRole) {
      return next(new RecordNotFoundException('record_not_found'));
    }

    res.tenantProjectId = projectRole.id;
  }

  return next();
};
