import express, { Request, Response } from 'express';
import { Permission } from '../.../../../shared/types';
import { UnprocessableEntityException } from '../../shared/exceptions/unprocessableEntity';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler from '../middleware/permissionsHandler';
import { RolesRepository } from '../repositories/roles';

const app = express();

app.get(
  '/roles',
  permissionsHandler([{ collection: 'superfast_roles', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new RolesRepository();

    const roles = await repository.read();

    res.json({ roles: roles });
  })
);

app.get(
  '/roles/:id',
  permissionsHandler([{ collection: 'superfast_roles', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new RolesRepository();

    const role = await repository.readOne(id);

    res.json({ role: role });
  })
);

app.post(
  '/roles',
  permissionsHandler([{ collection: 'superfast_roles', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new RolesRepository();

    const role = await repository.create(req.body);

    res.json({
      role: role,
    });
  })
);

app.patch(
  '/roles/:id',
  permissionsHandler([{ collection: 'superfast_roles', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new RolesRepository();

    await repository.update(id, req.body);

    res.status(204).end();
  })
);

app.delete(
  '/roles/:id',
  permissionsHandler([{ collection: 'superfast_roles', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
    const id = Number(req.params.id);
    const repository = new RolesRepository();

    const users = await database('superfast_users').where('role_id', id);
    if (users.length > 0) {
      throw new UnprocessableEntityException('can_not_delete_role_in_use');
    }

    const role = await repository.readOne(id);
    if (role.adminAccess) {
      const roles = await repository.read({ adminAccess: true });
      if (roles.length === 1) {
        throw new UnprocessableEntityException('can_not_delete_last_admin_role');
      }
    }

    await repository.transaction(async (tx) => {
      try {
        await repository.transacting(tx).delete(id);
        await tx.transaction('superfast_permissions').where('role_id', id).delete();
        await tx.transaction.commit();
        res.status(204).end();
      } catch (e) {
        await tx.transaction.rollback();
        res.status(500).end();
      }
    });
  })
);

app.get(
  '/roles/:id/permissions',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
    const id = req.params.id;

    const permissions = await database<Permission>('superfast_permissions').where('role_id', id);
    res.json({ permissions: permissions });
  })
);

app.post(
  '/roles/:id/permissions',
  permissionsHandler([{ collection: 'superfast_permissions', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
    const id = Number(req.params.id);

    const data = {
      ...req.body,
      role_id: id,
    };

    const permissions = await database<Permission>('superfast_permissions').insert(data, 'id');

    res.json({
      permission: permissions[0],
    });
  })
);

app.delete(
  '/roles/:id/permissions/:permissionId',
  permissionsHandler([{ collection: 'superfast_permissions', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
    const permissionId = Number(req.params.permissionId);

    await database('superfast_permissions').where('id', permissionId).delete();

    res.status(204).end();
  })
);

export default app;
