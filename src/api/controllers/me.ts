import express, { Request, Response } from 'express';
import { cookieOptions } from '../../constants.js';
import { env } from '../../env.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { UsersService } from '../services/users.js';
import { getExtractJwt } from '../utilities/getExtractJwt.js';
import { oneWayHash } from '../utilities/oneWayHash.js';
import { sign } from '../utilities/sign.js';
import { verifyJwt } from '../utilities/verifyJwt.js';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService(prisma);

    // Get access token from request parameter.
    if (req.userId) {
      const me = await service.findMe({ id: req.userId.toString() });
      if (!me?.auth) throw new RecordNotFoundException('record_not_found');
      me.auth.appAccess = req.appAccess || false;

      const accessToken = sign(me.auth, env.ACCESS_TOKEN_TTL);
      const refreshToken = sign(me.auth, env.REFRESH_TOKEN_TTL);

      res.cookie(`${env.COOKIE_PREFIX}-refresh-token`, refreshToken, cookieOptions);

      return res.json({
        user: me.auth,
        email: me.email,
        apiKey: me.apiKey,
        token: accessToken,
      });
    }

    // Get refresh token from cookie.
    const token = getExtractJwt(req);
    if (token) {
      const verified = verifyJwt(token);
      const me = await service.findMe({ id: verified.id });
      if (!me) throw new RecordNotFoundException('record_not_found');

      return res.json({
        user: me.auth,
        email: me.email,
        apiKey: me.apiKey,
        token: token,
      });
    }

    res.json({ user: null, apiKey: null, token: null });
  })
);

router.patch(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.userId?.toString();
    if (!id) {
      throw new InvalidCredentialsException('invalid_user_credentials');
    }

    const service = new UsersService(prisma);
    await service.checkUniqueEmail(req.body.email, id);

    const data = req.body.password
      ? { ...req.body, password: await oneWayHash(req.body.password) }
      : req.body;

    await service.update(id, data);

    res.status(204).end();
  })
);

export const me = router;
