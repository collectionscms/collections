import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { PermissionsRepository } from '../repositories/permissions.js';
import { RolesRepository } from '../repositories/roles.js';
import { UsersRepository } from '../repositories/users.js';

const router = express.Router();

router.get(
  '/roles',
  permissionsHandler([{ collection: 'superfast_roles', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new RolesRepository();

    const roles = await repository.read();

    res.json({ roles });
  })
);

router.get(
  '/roles/:id',
  permissionsHandler([{ collection: 'superfast_roles', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new RolesRepository();

    const role = await repository.readOne(id);
    if (!role) throw new RecordNotFoundException('record_not_found');

    res.json({ role });
  })
);

router.post(
  '/roles',
  permissionsHandler([{ collection: 'superfast_roles', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new RolesRepository();

    const roleId = await repository.create(req.body);

    res.json({
      id: roleId,
    });
  })
);

router.patch(
  '/roles/:id',
  permissionsHandler([{ collection: 'superfast_roles', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new RolesRepository();

    await repository.update(id, req.body);

    res.status(204).end();
  })
);

router.delete(
  '/roles/:id',
  permissionsHandler([{ collection: 'superfast_roles', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new RolesRepository();
    const permissionsRepository = new PermissionsRepository();
    const usersRepository = new UsersRepository();

    const users = await usersRepository.read({ role_id: id });
    if (users.length > 0) {
      throw new UnprocessableEntityException('can_not_delete_role_in_use');
    }

    const role = await repository.readOne(id);
    if (role.admin_access) {
      const roles = await repository.read({ admin_access: true });
      if (roles.length === 1) {
        throw new UnprocessableEntityException('can_not_delete_last_admin_role');
      }
    }

    await repository.transaction(async (tx) => {
      await repository.transacting(tx).delete(id);
      await permissionsRepository.transacting(tx).deleteMany({ role_id: id });
      res.status(204).end();
    });
  })
);

router.get(
  '/roles/:id/permissions',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const permissionsRepository = new PermissionsRepository();

    const permissions = await permissionsRepository.read({ role_id: id });

    res.json({ permissions });
  })
);

router.post(
  '/roles/:id/permissions',
  permissionsHandler([{ collection: 'superfast_permissions', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const permissionsRepository = new PermissionsRepository();

    const data = {
      ...req.body,
      role_id: id,
    };

    const permissionId = await permissionsRepository.create(data);

    res.json({
      id: permissionId,
    });
  })
);

router.delete(
  '/roles/:id/permissions/:permissionId',
  permissionsHandler([{ collection: 'superfast_permissions', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const permissionId = Number(req.params.permissionId);
    const permissionsRepository = new PermissionsRepository();

    await permissionsRepository.delete(permissionId);

    res.status(204).end();
  })
);

export const roles = router;
