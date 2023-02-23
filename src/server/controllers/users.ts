import { oneWayHash } from '../utilities/oneWayHash';
import { Role, User } from '@shared/types';
import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/users',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const users = await database
      .select('u.*', {
        roleId: 'r.id',
        roleName: 'r.name',
        roleDescription: 'r.description',
        roleAdminAccess: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.superfast_role_id');

    res.json({
      users: users.flatMap(({ password, ...user }) => ({
        ...user,
        role: {
          id: user.roleId,
          name: user.roleName,
          description: user.roleDescription,
          adminAccess: user.roleAdminAccess,
        },
        ...(delete user.roleId &&
          delete user.roleName &&
          delete user.roleDescription &&
          delete user.roleAdminAccess &&
          user),
      })),
    });
  })
);

app.post(
  '/users',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const role = await database<Role>('superfast_roles').where('id', req.body.roleId).first();
    const password = await oneWayHash(req.body.password);

    const data = {
      ...req.body,
      password: password,
      superfastRoleId: role.id,
      ...(delete req.body.roleId && delete req.body.password, req.body),
    };

    const user = await database<User>('superfast_users')
      .queryContext({ toSnake: true })
      .insert(data);

    res.json({
      user: user,
    });
  })
);

export default app;
