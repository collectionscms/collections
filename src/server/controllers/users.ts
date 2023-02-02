import asyncMiddleware from '../middleware/async';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const app = express();

app.get(
  '/users',
  asyncMiddleware(async (req: Request, res: Response) => {
    const users = await prisma.superfastUser.findMany({ include: { superfastRole: true } });

    res.json({
      users: users.flatMap(({ password, ...user }) => ({
        ...user,
        role: user.superfastRole,
        ...(delete user.superfastRole && user),
      })),
    });
  })
);

export default app;
