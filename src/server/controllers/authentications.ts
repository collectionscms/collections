import argon2 from 'argon2';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler from '../middleware/permissionsHandler';

const app = express();

app.post(
  '/authentications/login',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await fetchMe({ email: req.body.email });
    if (!user || !(await argon2.verify(user.password, req.body.password))) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    const token = toToken(user);

    res.json({
      token: token,
    });
  })
);

app.get(
  '/me',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await fetchMe({ id: req.userId });
    const token = toToken(user);

    res.json({
      token: token,
    });
  })
);

type MeUser = {
  id: number;
  roleId: number;
  userName: string;
  password: string;
  adminAccess: boolean;
  apiKey: string | null;
};

const fetchMe = async (params: { email?: string; id?: number }): Promise<MeUser> => {
  const condition = {};

  if (params.email) {
    condition['u.email'] = params.email;
  }

  if (params.id) {
    condition['u.id'] = params.id;
  }

  const database = await getDatabase();
  const user = await database
    .select('u.id', 'u.user_name', 'u.password', 'u.api_key', {
      role_id: 'r.id',
      admin_access: 'r.admin_access',
    })
    .from('superfast_users AS u')
    .join('superfast_roles AS r', 'r.id', 'u.superfast_role_id')
    .where(condition)
    .first();

  return user;
};

const toToken = (user: MeUser) => {
  delete user.password;
  const token = jwt.sign(user, process.env.SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL,
  });

  return token;
};

export default app;
