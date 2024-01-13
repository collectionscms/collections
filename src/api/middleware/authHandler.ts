import { NextFunction, Request, RequestHandler, Response } from 'express';
import { prisma } from '../database/prisma/client.js';
import { UsersService } from '../services/users.js';
import { verifyJwt } from '../utilities/verifyJwt.js';
import { asyncHandler } from './asyncHandler.js';

export const authHandler: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (req.token) {
      const service = new UsersService(prisma);
      const me = await service.findMe({ apiKey: req.token });
      const auth = me?.auth || verifyJwt(req.token);

      if (auth) {
        req.userId = auth.id;
        req.adminAccess = auth.adminAccess;
        req.roleId = auth.roleId;
        req.appAccess = auth.appAccess ?? false;
      }
    }

    return next();
  }
);
