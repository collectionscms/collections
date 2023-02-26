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
        req.user = user.id;
        req.adminAccess = user.adminAccess;
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
  const database = await getDatabase();
  return await database('superfast_users').where('api_key', token).first();
};

export default asyncHandler(authHandler);
