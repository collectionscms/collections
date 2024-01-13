import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { PermissionsService } from '../services/permissions.js';
import { RolesService } from '../services/roles.js';

const router = express.Router();

router.get(
  '/roles',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new RolesService(prisma);
    const roles = await service.findRoles();

    res.json({ roles });
  })
);

router.get(
  '/roles/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new RolesService(prisma);
    const role = await service.findRole(req.params.id);

    if (!role) throw new RecordNotFoundException('record_not_found');

    res.json({ role });
  })
);

router.post(
  '/roles',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new RolesService(prisma);
    const roleId = await service.create(req.body);

    res.json({
      id: roleId,
    });
  })
);

router.patch(
  '/roles/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new RolesService(prisma);
    await service.update(req.params.id, req.body);

    res.status(204).end();
  })
);

router.delete(
  '/roles/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new RolesService(prisma);
    await service.delete(req.params.id);

    res.status(204).end();
  })
);

router.get(
  '/roles/:id/permissions',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new PermissionsService(prisma);
    const permissions = await service.findRolePermissions(req.params.id);

    res.json({ permissions });
  })
);

router.post(
  '/roles/:id/permissions',
  asyncHandler(async (req: Request, res: Response) => {
    // const id = Number(req.params.id);
    // const data = {
    //   ...req.body,
    //   roleId: id,
    // };

    // const service = new PermissionsService(prisma);
    // const permissionId = await permissionsService.createOne(data);

    // res.json({
    //   id: permissionId,
    // });

    res.status(204).end();
  })
);

router.delete(
  '/roles/:id/permissions/:permissionId',
  asyncHandler(async (req: Request, res: Response) => {
    // const permissionId = Number(req.params.permissionId);

    // const service = new PermissionsService(prisma);
    // await permissionsService.deleteOne(permissionId);

    res.status(204).end();
  })
);

export const roles = router;
