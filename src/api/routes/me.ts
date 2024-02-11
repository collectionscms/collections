import { getSession } from '@auth/express';
import express, { Request, Response } from 'express';
import { authConfig } from '../configs/auth.js';
import { UserEntity } from '../data/user/user.entity.js';
import { UserRepository } from '../data/user/user.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
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

    const repository = new UserRepository();
    await repository.checkUniqueEmail(prisma, id, req.body.email);

    const user = await repository.findUser(prisma, id);
    const password = req.body.password ? await oneWayHash(req.body.password) : user.password;

    const entity = UserEntity.Reconstruct({
      ...user,
      password,
      name: req.body.name,
      email: req.body.email,
    });
    await repository.update(prisma, id, entity);

    res.status(204).end();
  })
);

export const me = router;
