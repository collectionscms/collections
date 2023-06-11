import express, { Request, Response } from 'express';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { UsersRepository } from '../repositories/users.js';
import { decodeJwt } from '../utilities/decodeJwt.js';
import { getExtractJwt } from '../utilities/getExtractJwt.js';
import { sign } from '../utilities/sign.js';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();

    if (req.userId) {
      const user = await repository.readMe({ id: Number(req.userId) });
      if (!user) {
        throw new InvalidCredentialsException('token_invalid_or_expired');
      }
      user.appAccess = true;

      const token = sign(user);
      const decoded = decodeJwt(token);

      return res.json({
        user,
        token,
        exp: decoded?.exp || 0,
      });
    }

    const token = getExtractJwt(req);
    if (token) {
      const decoded = decodeJwt(token);
      return res.json({ user: decoded, token: token, exp: decoded?.exp || 0 });
    }

    res.json({ user: null, token: null, exp: 0 });
  })
);

export const me = router;
