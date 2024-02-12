import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { PermissionRepository } from '../data/permission/permission.repository.js';
import { RoleEntity } from '../data/role/role.entity.js';
import { RoleRepository } from '../data/role/role.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.get(
  '/roles',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const repository = new RoleRepository();
    const roles = await repository.findRoles(prisma);

    res.json({ roles });
  })
);

router.get(
  '/roles/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new RoleRepository();
    const role = await repository.findRole(prisma, req.params.id);

    if (!role) throw new RecordNotFoundException('record_not_found');

    res.json({ role });
  })
);

router.post(
  '/roles',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const entity = RoleEntity.Construct({
      projectId: res.user.projects[0].id,
      name: req.body.name,
      description: req.body.description,
    });

    const repository = new RoleRepository();
    const role = await repository.create(prisma, entity);

    res.json(role.toJson());
  })
);

router.patch(
  '/roles/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new RoleRepository();
    const role = await repository.findRole(prisma, req.params.id);
    const entity = RoleEntity.Reconstruct({
      ...role,
      name: req.body.name,
      description: req.body.description,
    });

    await repository.update(prisma, role.id, entity);

    res.status(204).end();
  })
);

router.delete(
  '/roles/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new RoleRepository();
    await repository.delete(prisma, req.params.id);

    res.status(204).end();
  })
);

router.get(
  '/roles/:id/permissions',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new PermissionRepository();
    const permissions = await repository.findPermissions(prisma, req.params.id);

    res.json({ permissions });
  })
);

export const role = router;
