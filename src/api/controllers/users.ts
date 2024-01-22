import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { UsersService } from '../services/users.js';
import { oneWayHash } from '../utilities/oneWayHash.js';

const router = express.Router();

router.get(
  '/users',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService(prisma);
    const users = await service.findUsers();

    res.json({
      users,
    });
  })
);

router.get(
  '/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService(prisma);
    const user = await service.findUser(req.params.id);

    if (!user) throw new RecordNotFoundException('record_not_found');

    res.json({
      user,
    });
  })
);

router.post(
  '/users',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService(prisma);
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
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const service = new UsersService(prisma);
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
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (req.userId === id) {
      throw new UnprocessableEntityException('can_not_delete_itself');
    }

    const service = new UsersService(prisma);
    await service.delete(id);

    res.status(204).end();
  })
);

router.post(
  '/users/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.token;
    const password = req.body.password;

    const service = new UsersService(prisma);
    await service.resetPassword(token, password);

    res.status(204).end();
  })
);

router.post(
  '/users/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService(prisma);
    const resetPasswordToken = await service.setResetPasswordToken(req.body.email);

    service.sendResetPassword(req.body.email, resetPasswordToken);

    res.json({
      message: 'success',
    });
  })
);

export const users = router;
