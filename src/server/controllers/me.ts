import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { UsersRepository } from '../repositories/users.js';
import { decodeJwt } from '../utilities/decodeJwt.js';
import { sign } from '../utilities/sign.js';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();

    const user = await repository.readMe({ id: Number(req.userId) });
    if (!user) {
      return res.json({ user: null, token: null, exp: 0 });
    }
    user.appAccess = true;

    const token = sign(user);
    const decoded = decodeJwt(token);

    res.json({
      user,
      token,
      exp: decoded?.exp || 0,
    });
  })
);

export const me = router;
