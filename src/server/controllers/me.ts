import express, { Request, Response } from 'express';
import { cookieOptions } from '../../constants.js';
import { env } from '../../env.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { UsersRepository } from '../repositories/users.js';
import { getExtractJwt } from '../utilities/getExtractJwt.js';
import { sign } from '../utilities/sign.js';
import { verifyJwt } from '../utilities/verifyJwt.js';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    // Get access token from request parameter.
    if (req.userId) {
      const repository = new UsersRepository();
      const user = await repository.readMe({ id: Number(req.userId) });
      if (!user) throw new RecordNotFoundException('record_not_found');
      user.appAccess = true;

      const accessToken = sign(user, env.ACCESS_TOKEN_TTL);
      const refreshToken = sign(user, env.REFRESH_TOKEN_TTL);

      res.cookie(`${env.COOKIE_PREFIX}-refresh-token`, refreshToken, cookieOptions);

      return res.json({
        user,
        token: accessToken,
      });
    }

    // Get refresh token from cookie.
    const token = getExtractJwt(req);
    if (token) {
      const verified = verifyJwt(token);
      return res.json({ user: verified, token: token });
    }

    res.json({ user: null, token: null });
  })
);

export const me = router;
