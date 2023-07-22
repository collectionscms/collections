import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UsersRepository } from '../repositories/users.js';
import { verifyJwt } from '../utilities/verifyJwt.js';
import { asyncHandler } from './asyncHandler.js';

export const authHandler: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (req.token) {
      const repository = new UsersRepository();
      const user = (await repository.readMe({ apiKey: req.token })) || verifyJwt(req.token);

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
