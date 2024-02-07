import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { UserService } from '../services/user.js';
import { oneWayHash } from '../utilities/oneWayHash.js';

const router = express.Router();

router.get(
  '/users',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const service = new UserService(prisma);
    const users = await service.findUsers();

    res.json({
      users,
    });
  })
);

router.get(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UserService(prisma);
    const user = await service.findUser(req.params.id);

    if (!user) throw new RecordNotFoundException('record_not_found');

    res.json({
      user,
    });
  })
);

router.post(
  '/users',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UserService(prisma);
    await service.checkUniqueEmail(req.body.email);

    const hashed = await oneWayHash(req.body.password);
    const user = await service.create({ ...req.body, password: hashed });

    res.json({
      id: user.id,
    });
  })
);

router.patch(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const service = new UserService(prisma);
    await service.checkUniqueEmail(req.body.email, id);

    const data = req.body.password
      ? { ...req.body, password: await oneWayHash(req.body.password) }
      : req.body;

    await service.update(id, data);

    res.status(204).end();
  })
);

router.delete(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.session.user.id;
    const id = req.params.id;
    if (userId === id) {
      throw new UnprocessableEntityException('can_not_delete_itself');
    }

    const service = new UserService(prisma);
    await service.delete(id);

    res.status(204).end();
  })
);

router.post(
  '/users/reset-password',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.token;
    const password = req.body.password;

    const service = new UserService(prisma);
    await service.resetPassword(token, password);

    res.status(204).end();
  })
);

router.post(
  '/users/forgot-password',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UserService(prisma);
    const resetPasswordToken = await service.setResetPasswordToken(req.body.email);

    service.sendResetPassword(req.body.email, resetPasswordToken);

    res.json({
      message: 'success',
    });
  })
);

export const user = router;
