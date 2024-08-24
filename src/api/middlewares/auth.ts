import { getSession } from '@auth/express';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { env } from '../../env.js';
import { InvalidTokenException } from '../../exceptions/invalidToken.js';
import { UnauthorizedException } from '../../exceptions/unauthorized.js';
import { ProjectWithRole } from '../../types/index.js';
import { authConfig } from '../configs/auth.js';
import { ApiKeyRepository } from '../persistence/apiKey/apiKey.repository.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { GetApiKeyProjectRolesUseCase } from '../useCases/apiKey/getApiKeyProjectRoles.useCase.js';
import { GetMyProjectRolesUseCase } from '../useCases/me/getMyProjectRoles.useCase.js';
import { errorHandler } from './errorHandler.js';

// Get current session from auth
export const currentSession = async (req: Request, res: Response, next: NextFunction) => {
  const session = await getSession(req, authConfig);
  if (session?.user) {
    res.user = session?.user;
  }
  return next();
};

// Extract token from authentication headers, Bearer <token>
export const extractToken: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');

    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      req.token = parts[1];
      return next();
    }
  }

  next();
};

export const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  const sessionUser = res.user;
  const token = req.token;
  if (!sessionUser && !token) return errorHandler(new UnauthorizedException(), req, res, next);

  let projectRoles: {
    [key: string]: ProjectWithRole;
  } = {};

  try {
    if (sessionUser) {
      const useCase = new GetMyProjectRolesUseCase(bypassPrisma, new UserRepository());
      const record = await useCase.execute(sessionUser.id);
      projectRoles = record.projectRoles;
    } else if (token) {
      const useCase = new GetApiKeyProjectRolesUseCase(bypassPrisma, new ApiKeyRepository());
      const record = await useCase.execute(token);
      projectRoles = { [record.subdomain]: record };
    }
  } catch (error) {
    return errorHandler(error, req, res, next);
  }

  // When accessing tenants, check has role to project
  const subdomain = req.subdomains[0];
  if (subdomain !== env.PUBLIC_PORTAL_SUBDOMAIN) {
    const projectRole = projectRoles[subdomain];
    if (!projectRole) {
      return errorHandler(new InvalidTokenException(), req, res, next);
    }

    res.projectRole = projectRole;
  }

  return next();
};
