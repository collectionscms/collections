import express, { Request, Response } from 'express';
import { Permission, Role } from '../.../../../shared/types';
import { UnprocessableEntityException } from '../../shared/exceptions/unprocessableEntity';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';

const app = express();

app.get(
  '/roles',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const roles = await database<Role>(ROLE_TABLE_NAME);
    res.json({ roles: roles });
  })
);

app.get(
  '/roles/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = req.params.id;
    const role = await database<Role>(ROLE_TABLE_NAME).where('id', id).first();

    res.json({ role: role });
  })
);

app.post(
  '/roles',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();

    const roles = await database<Role>(ROLE_TABLE_NAME)
      .queryContext({ toSnake: true })
      .insert(req.body, 'id');

    res.json({
      role: roles[0],
    });
  })
);

app.patch(
  '/roles/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);

    await database(ROLE_TABLE_NAME)
      .queryContext({ toSnake: true })
      .where('id', id)
      .update(req.body);

    res.status(204).end();
  })
);

const checkForOtherAdminRoles = async () => {
  const database = await getDatabase();
  const adminRole = await database(ROLE_TABLE_NAME)
    .count('*', { as: 'count' })
    .where('admin_access', true)
    .first();

  if (adminRole.count === 1) {
    throw new UnprocessableEntityException('can_not_delete_last_admin_role');
  }
};

app.delete(
  '/roles/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);

    const users = await database(USER_TABLE_NAME).where('superfast_role_id', id);
    if (users.length > 0) {
      throw new UnprocessableEntityException('can_not_delete_role_in_use');
    }

    const role = await database<Role>(ROLE_TABLE_NAME).where('id', id).first();
    if (role.adminAccess) {
      await checkForOtherAdminRoles();
    }

    await database.transaction(async (tx) => {
      try {
        await tx(ROLE_TABLE_NAME).where('id', id).delete();
        await tx(PERMISSION_TABLE_NAME).where('superfast_role_id', id).delete();
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
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = req.params.id;

    const permissions = await database<Permission>(PERMISSION_TABLE_NAME).where(
      'superfast_role_id',
      id
    );
    res.json({ permissions: permissions });
  })
);

app.post(
  '/roles/:id/permissions',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);

    const data = {
      ...req.body,
      superfast_role_id: id,
    };

    const permissions = await database<Permission>(PERMISSION_TABLE_NAME)
      .queryContext({ toSnake: true })
      .insert(data, 'id');

    res.json({
      permission: permissions[0],
    });
  })
);

app.delete(
  '/roles/:id/permissions/:permissionId',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const permissionId = Number(req.params.permissionId);

    await database(PERMISSION_TABLE_NAME).where('id', permissionId).delete();

    res.status(204).end();
  })
);

const USER_TABLE_NAME = 'superfast_users';
const ROLE_TABLE_NAME = 'superfast_roles';
const PERMISSION_TABLE_NAME = 'superfast_permissions';

export default app;
