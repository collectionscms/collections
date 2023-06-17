import express, { CookieOptions, Request, Response } from 'express';
import ms from 'ms';
import { env } from '../../env.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { UsersRepository } from '../repositories/users.js';
import { decodeJwt } from '../utilities/decodeJwt.js';
import { sign } from '../utilities/sign.js';

const router = express.Router();

router.post(
  '/authentications/login',
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();

    const user = await repository.login(req.body.email, req.body.password);
    user.appAccess = true;

    const token = sign(user);
    const decoded = decodeJwt(token);

    const cookieOptions: CookieOptions = {
      path: '/',
      httpOnly: true,
      maxAge: ms(env.REFRESH_TOKEN_TTL as string),
      secure: env.COOKIE_SECURE ?? false,
      sameSite: (env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'strict',
      domain: env.COOKIE_DOMAIN,
    };
    res.cookie(`${env.COOKIE_PREFIX}-token`, token, cookieOptions);

    res.json({
      token,
      user,
    });
  })
);

router.post(
  '/authentications/logout',
  asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(`${env.COOKIE_PREFIX}-token`);
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
