import { NextFunction, Request, RequestHandler, Response } from 'express';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { UsersRepository } from '../repositories/users.js';
import { decodeJwt } from '../utilities/decodeJwt.js';
import { asyncHandler } from './asyncHandler.js';

const _authHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const repository = new UsersRepository();

  try {
    if (req.token) {
      const user = decodeJwt(req.token) || (await repository.readMe({ token: req.token }));
      if (user) {
        req.userId = user.id;
        req.adminAccess = user.adminAccess;
        req.roleId = user.roleId;
        req.appAccess = user.appAccess ?? false;
      } else {
        return next(new InvalidCredentialsException('invalid_user_credentials'));
      }
    }

    return next();
  } catch (e) {
    return next(
      new InvalidCredentialsException('invalid_user_credentials', { message: (e as Error).message })
    );
  }
};

export const authHandler = asyncHandler(_authHandler);
