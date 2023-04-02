import { NextFunction, Request, RequestHandler, Response } from 'express';
import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import UsersRepository from '../repositories/users';
import { decodeJwt } from '../utilities/decodeJwt';
import asyncHandler from './asyncHandler';

const authHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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
      new InvalidCredentialsException('invalid_user_credentials', { message: e.message })
    );
  }
};

export default asyncHandler(authHandler);
