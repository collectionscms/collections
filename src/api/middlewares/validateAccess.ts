import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../../exceptions/forbidden.js';
import { InvalidTokenException } from '../../exceptions/invalidToken.js';

export const validateAccess =
  (actions: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    const projectRole = res.projectRole;
    if (!projectRole) {
      return next(new InvalidTokenException());
    }

    if (projectRole.role.isAdmin) {
      return next();
    }

    if (projectRole.role.permissions.some((p) => actions.includes(p.action))) {
      return next();
    }

    return next(new ForbiddenException('forbidden'));
  };
