import argon2 from 'argon2';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import { MeUser } from '../../shared/types';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler from '../middleware/permissionsHandler';
import UsersRepository from '../repositories/users';

const app = express();

app.post(
  '/authentications/login',
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();

    const user = await repository.readMe({ email: req.body.email });
    if (!user || !(await argon2.verify(user.password, req.body.password))) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    const token = toToken(user);

    res.json({
      token,
    });
  })
);

app.get(
  '/me',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();

    const user = await repository.readMe({ id: req.userId });
    const token = toToken(user);

    res.json({
      token,
    });
  })
);

const toToken = (user: MeUser) => {
  delete user.password;
  const token = jwt.sign(user, process.env.SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL,
  });

  return token;
};

export default app;
