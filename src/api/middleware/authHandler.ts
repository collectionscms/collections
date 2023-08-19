import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UsersService } from '../services/users.js';
import { verifyJwt } from '../utilities/verifyJwt.js';
import { asyncHandler } from './asyncHandler.js';

export const authHandler: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (req.token) {
      const service = new UsersService({ schema: req.schema });
      const me = await service.readMe({ apiKey: req.token });
      const user = me?.user || verifyJwt(req.token);

      if (user) {
        req.userId = user.id;
        req.adminAccess = user.adminAccess;
        req.roleId = user.roleId;
        req.appAccess = user.appAccess ?? false;
      }
    }

    return next();
  }
);
