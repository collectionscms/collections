import argon2 from 'argon2';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';

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
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new InvalidCredentialsException('invalid_user_credentials');
    }

    const user = await fetchMe({ id: req.user });
    const token = toToken(user);

    res.json({
      token: token,
    });
  })
);

type AuthUser = {
  id: number;
  userName: string;
  password: string;
  apiKey: string | null;
  roleAdminAccess: boolean;
};

const fetchMe = async (params: { email?: string; id?: number }): Promise<AuthUser> => {
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
      role_admin_access: 'r.admin_access',
    })
    .from('superfast_users AS u')
    .join('superfast_roles AS r', 'r.id', 'u.superfast_role_id')
    .where(condition)
    .first();

  return user;
};

const toToken = (user: AuthUser) => {
  const payload = {
    id: user.id,
    userName: user.userName,
    adminAccess: user.roleAdminAccess,
    apiKey: user.apiKey,
  };

  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL,
  });

  return token;
};

export default app;
