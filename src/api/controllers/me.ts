import express, { Request, Response } from 'express';
import { cookieOptions } from '../../constants.js';
import { env } from '../../env.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { UsersService } from '../services/users.js';
import { getExtractJwt } from '../utilities/getExtractJwt.js';
import { sign } from '../utilities/sign.js';
import { verifyJwt } from '../utilities/verifyJwt.js';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService({ schema: req.schema });

    // Get access token from request parameter.
    if (req.userId) {
      const me = await service.readMe({ primaryKey: Number(req.userId) });
      if (!me?.user) throw new RecordNotFoundException('record_not_found');
      me.user.appAccess = true;

      const accessToken = sign(me.user, env.ACCESS_TOKEN_TTL);
      const refreshToken = sign(me.user, env.REFRESH_TOKEN_TTL);

      res.cookie(`${env.COOKIE_PREFIX}-refresh-token`, refreshToken, cookieOptions);

      return res.json({
        user: me.user,
        apiKey: me.apiKey,
        token: accessToken,
      });
    }

    // Get refresh token from cookie.
    const token = getExtractJwt(req);
    if (token) {
      const verified = verifyJwt(token);
      const me = await service.readMe({ primaryKey: verified.id });
      if (!me) throw new RecordNotFoundException('record_not_found');

      return res.json({ user: me.user, apiKey: me.apiKey, token: token });
    }

    res.json({ user: null, apiKey: null, token: null });
  })
);

export const me = router;
