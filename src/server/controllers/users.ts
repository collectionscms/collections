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
        role_id: 'r.id',
        role_name: 'r.name',
        role_description: 'r.description',
        role_admin_access: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.superfast_role_id');

    res.json({
      users: users.flatMap(({ password, ...user }) => ({
        ...user,
        role: {
          id: user.role_id,
          name: user.role_name,
          description: user.role_description,
          admin_access: user.role_admin_access,
        },
        ...(delete user.role_id &&
          delete user.role_name &&
          delete user.role_description &&
          delete user.role_admin_access &&
          user),
      })),
    });
  })
);

export default app;
