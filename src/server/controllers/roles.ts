import asyncMiddleware from '../middleware/async';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const app = express();

app.get(
  '/roles',
  asyncMiddleware(async (req: Request, res: Response) => {
    const roles = await prisma.superfastRole.findMany({ include: { superfastPermissions: true } });

    res.json({
      roles: roles.flatMap((role) => ({
        ...role,
        permissions: role.superfastPermissions,
        ...(delete role.superfastPermissions && role),
      })),
    });
  })
);

export default app;
