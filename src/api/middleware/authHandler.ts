import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UsersService } from '../services/users.js';
import { verifyJwt } from '../utilities/verifyJwt.js';
import { asyncHandler } from './asyncHandler.js';

export const authHandler: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (req.token) {
      const service = new UsersService({ schema: req.schema });
      const me = await service.readMe({ apiKey: req.token });
      const auth = me?.auth || verifyJwt(req.token);

      if (auth) {
        req.userId = auth.id;
        req.adminAccess = auth.admin_access;
        req.roleId = auth.role_id;
        req.appAccess = auth.admin_access ?? false;
      }
    }

    return next();
  }
);
