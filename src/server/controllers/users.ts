import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import { Role, User } from '@shared/types';
import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';
import { oneWayHash } from '../utilities/oneWayHash';

const app = express();

app.get(
  '/users',
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new InvalidCredentialsException('invalid_user_credentials');
    }

    const database = await getDatabase();
    const users = await database
      .select('u.*', {
        roleId: 'r.id',
        roleName: 'r.name',
        roleDescription: 'r.description',
        roleAdminAccess: 'r.admin_access',
      })
      .from(`${USER_TABLE_NAME} AS u`)
      .join(`${ROLE_TABLE_NAME} AS r`, 'r.id', 'u.superfast_role_id');

    res.json({
      users: users.flatMap(({ password, ...user }) => payload(user)),
    });
  })
);

app.get(
  '/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = req.params.id;

    const user = await database
      .select('u.*', {
        roleId: 'r.id',
        roleName: 'r.name',
        roleDescription: 'r.description',
        roleAdminAccess: 'r.admin_access',
      })
      .from(`${USER_TABLE_NAME} AS u`)
      .join(`${ROLE_TABLE_NAME} AS r`, 'r.id', 'u.superfast_role_id')
      .where('u.id', id)
      .first();

    if (!user) return res.status(400).end();

    res.json({
      user: payload(user),
    });
  })
);

app.post(
  '/users',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const role = await database<Role>(ROLE_TABLE_NAME).where('id', req.body.roleId).first();
    const password = await oneWayHash(req.body.password);

    const data = {
      ...req.body,
      password: password,
      superfastRoleId: role.id,
      ...(delete req.body.roleId && delete req.body.password, req.body),
    };

    const users = await database<User>(USER_TABLE_NAME)
      .queryContext({ toSnake: true })
      .insert(data, 'id');

    res.json({
      user: users[0],
    });
  })
);

app.patch(
  '/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);
    const role = await database<Role>(ROLE_TABLE_NAME).where('id', req.body.roleId).first();

    const data = {
      ...req.body,
      superfastRoleId: role.id,
      ...(delete req.body.roleId && delete req.body.password, req.body),
    };

    if (req.body.password) {
      data.password = await oneWayHash(req.body.password);
    }

    await database(USER_TABLE_NAME).queryContext({ toSnake: true }).where('id', id).update(data);

    res.status(204).end();
  })
);

app.delete(
  '/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);

    await database(USER_TABLE_NAME).where('id', id).delete();

    res.status(204).end();
  })
);

const payload = (user: any) => {
  return {
    id: user.id,
    lastName: user.lastName,
    firstName: user.firstName,
    userName: user.userName,
    email: user.email,
    isActive: user.isActive,
    apiKey: user.apiKey,
    updatedAt: user.updatedAt,
    role: {
      id: user.roleId,
      name: user.roleName,
      description: user.roleDescription,
      adminAccess: user.roleAdminAccess,
    },
  };
};
const USER_TABLE_NAME = 'superfast_users';
const ROLE_TABLE_NAME = 'superfast_roles';

export default app;
