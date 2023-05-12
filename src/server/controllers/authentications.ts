import argon2 from 'argon2';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { MeUser } from '../../config/types.js';
import { env } from '../../env.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { UsersRepository } from '../repositories/users.js';

const router = express.Router();

router.post(
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

router.get(
  '/me',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();

    const user = await repository.readMe({ id: Number(req.userId) });
    const token = toToken(user);

    res.json({
      token,
    });
  })
);

const toToken = (user: MeUser) => {
  const tokenizedUser: Omit<MeUser, 'password'> = { ...user };
  tokenizedUser.appAccess = true;
  const token = jwt.sign(tokenizedUser, env.SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL,
  });

  return token;
};

export const authentications = router;
