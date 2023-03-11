import express, { Request, Response } from 'express';
import { Permission, Role } from '../.../../../shared/types';
import { UnprocessableEntityException } from '../../shared/exceptions/unprocessableEntity';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler from '../middleware/permissionsHandler';

const app = express();

app.get(
  '/roles',
  permissionsHandler([{ collection: 'superfast_roles', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const roles = await database<Role>('superfast_roles');
    res.json({ roles: roles });
  })
);

app.get(
  '/roles/:id',
  permissionsHandler([{ collection: 'superfast_roles', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = req.params.id;
    const role = await database<Role>('superfast_roles').where('id', id).first();

    res.json({ role: role });
  })
);

app.post(
  '/roles',
  permissionsHandler([{ collection: 'superfast_roles', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();

    const roles = await database<Role>('superfast_roles')
      .queryContext({ toSnake: true })
      .insert(req.body, 'id');

    res.json({
      role: roles[0],
    });
  })
);

app.patch(
  '/roles/:id',
  permissionsHandler([{ collection: 'superfast_roles', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);

    await database('superfast_roles')
      .queryContext({ toSnake: true })
      .where('id', id)
      .update(req.body);

    res.status(204).end();
  })
);

const checkForOtherAdminRoles = async () => {
  const database = await getDatabase();
  const adminRole = await database('superfast_roles')
    .count('*', { as: 'count' })
    .where('admin_access', true)
    .first();

  if (adminRole.count === 1) {
    throw new UnprocessableEntityException('can_not_delete_last_admin_role');
  }
};

app.delete(
  '/roles/:id',
  permissionsHandler([{ collection: 'superfast_roles', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);

    const users = await database('superfast_users').where('superfast_role_id', id);
    if (users.length > 0) {
      throw new UnprocessableEntityException('can_not_delete_role_in_use');
    }

    const role = await database<Role>('superfast_roles').where('id', id).first();
    if (role.adminAccess) {
      await checkForOtherAdminRoles();
    }

    await database.transaction(async (tx) => {
      try {
        await tx('superfast_roles').where('id', id).delete();
        await tx('superfast_permissions').where('superfast_role_id', id).delete();
        await tx.commit();
        res.status(204).end();
      } catch (e) {
        await tx.rollback();
        res.status(500).end();
      }
    });
  })
);

app.get(
  '/roles/:id/permissions',
  permissionsHandler([{ collection: 'superfast_permissions', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = req.params.id;

    const permissions = await database<Permission>('superfast_permissions').where(
      'superfast_role_id',
      id
    );
    res.json({ permissions: permissions });
  })
);

app.post(
  '/roles/:id/permissions',
  permissionsHandler([{ collection: 'superfast_permissions', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);

    const data = {
      ...req.body,
      superfast_role_id: id,
    };

    const permissions = await database<Permission>('superfast_permissions')
      .queryContext({ toSnake: true })
      .insert(data, 'id');

    res.json({
      permission: permissions[0],
    });
  })
);

app.delete(
  '/roles/:id/permissions/:permissionId',
  permissionsHandler([{ collection: 'superfast_permissions', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const permissionId = Number(req.params.permissionId);

    await database('superfast_permissions').where('id', permissionId).delete();

    res.status(204).end();
  })
);

export default app;
