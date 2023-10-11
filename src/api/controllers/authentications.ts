import express, { Request, Response } from 'express';
import { cookieOptions } from '../../constants.js';
import { env } from '../../env.js';
import { InvalidTokenException } from '../../exceptions/invalidToken.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { UsersService } from '../services/users.js';
import { getExtractJwt } from '../utilities/getExtractJwt.js';
import { sign } from '../utilities/sign.js';
import { verifyJwt } from '../utilities/verifyJwt.js';

const router = express.Router();

router.post(
  '/authentications/login',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService({ schema: req.schema });
    const user = await service.login(req.body.email, req.body.password);
    user.app_access = true;

    const accessToken = sign(user, env.ACCESS_TOKEN_TTL);
    const refreshToken = sign(user, env.REFRESH_TOKEN_TTL);

    res.cookie(`${env.COOKIE_PREFIX}-refresh-token`, refreshToken, cookieOptions);

    res.json({
      token: accessToken,
      user,
    });
  })
);

router.post(
  '/authentications/logout',
  asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(`${env.COOKIE_PREFIX}-refresh-token`);
    res.status(204).send();
  })
);

router.post(
  '/authentications/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    const token = getExtractJwt(req);
    if (!token) throw new InvalidTokenException();

    try {
      const user = verifyJwt(token);
      delete user.exp;
      delete user.iat;

      const accessToken = sign(user, env.ACCESS_TOKEN_TTL);
      const refreshToken = sign(user, env.REFRESH_TOKEN_TTL);

      res.cookie(`${env.COOKIE_PREFIX}-refresh-token`, refreshToken, cookieOptions);

      return res.json({
        token: accessToken,
      });
    } catch (e) {
      throw new InvalidTokenException();
    }
  })
);

export const authentications = router;
