import { NextFunction, Request, RequestHandler, Response } from 'express';
import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import { getDatabase } from '../database/connection';
import { decodeJwt } from '../utilities/decodeJwt';
import asyncHandler from './asyncHandler';

const authHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.token) {
      const user = decodeJwt(req.token) || (await fetchUserByApiKey(req.token));
      if (user) {
        req.userId = user.id;
        req.adminAccess = user.adminAccess;
        req.roleId = user.roleId;
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

const fetchUserByApiKey = async (token: string) => {
  const database = getDatabase();
  const user = await database
    .select('u.id', {
      roleId: 'r.id',
      adminAccess: 'r.admin_access',
    })
    .from('superfast_users AS u')
    .join('superfast_roles AS r', 'r.id', 'u.role_id')
    .where('u.api_key', token)
    .first();

  return user;
};

export default asyncHandler(authHandler);
