import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../../config/types.js';
import { env } from '../../env.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { UsersRepository } from '../repositories/users.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';

const router = express.Router();

router.post(
  '/authentications/login',
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();

    const user = await repository.login(req.body.email, req.body.password);
    const token = toToken(user);

    res.json({
      token,
    });
  })
);

const toToken = (user: AuthUser) => {
  user.appAccess = true;
  const token = jwt.sign(user, env.SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL,
  });

  return token;
};

export const authentications = router;
