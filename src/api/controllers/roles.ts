import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { PermissionsService } from '../services/permissions.js';
import { RolesService } from '../services/roles.js';

const router = express.Router();

router.get(
  '/roles',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const service = new RolesService(prisma);
    const roles = await service.findRoles();

    res.json({ roles });
  })
);

router.get(
  '/roles/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const service = new RolesService(prisma);
    const role = await service.findRole(req.params.id);

    if (!role) throw new RecordNotFoundException('record_not_found');

    res.json({ role });
  })
);

router.post(
  '/roles',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const service = new RolesService(prisma);
    const role = await service.create(req.body);

    res.json({
      id: role.id,
    });
  })
);

router.patch(
  '/roles/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const service = new RolesService(prisma);
    await service.update(req.params.id, req.body);

    res.status(204).end();
  })
);

router.delete(
  '/roles/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const service = new RolesService(prisma);
    await service.delete(req.params.id);

    res.status(204).end();
  })
);

router.get(
  '/roles/:id/permissions',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const service = new PermissionsService(prisma);
    const permissions = await service.findRolePermissions(req.params.id);

    res.json({ permissions });
  })
);

export const roles = router;
