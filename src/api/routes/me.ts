import { getSession } from '@auth/express';
import express, { Request, Response } from 'express';
import { authConfig } from '../configs/auth.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { UserService } from '../services/user.js';
import { oneWayHash } from '../utilities/oneWayHash.js';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const session = res.locals.session ?? (await getSession(req, authConfig));

    return res.json({
      me: session?.user || null,
    });
  })
);

router.patch(
  '/me',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = res.locals.session.user.id;

    const service = new UserService(prisma);
    await service.checkUniqueEmail(req.body.email, id);

    const data = req.body.password
      ? { ...req.body, password: await oneWayHash(req.body.password) }
      : req.body;

    await service.update(id, data);

    res.status(204).end();
  })
);

export const me = router;
