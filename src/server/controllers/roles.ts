import { Permission, Role } from '@shared/types';
import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/roles',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const roles = await database<Role>('superfast_roles');
    res.json({ roles: roles });
  })
);

app.get(
  '/roles/:id/permissions',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = req.params.id;

    const permissions = await database<Permission>('superfast_permissions').where(
      'superfast_role_id',
      id
    );
    res.json({ permissions: permissions });
  })
);

export default app;
