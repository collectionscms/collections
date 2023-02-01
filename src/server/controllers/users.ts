import asyncMiddleware from '../middleware/async';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const app = express();

app.get(
  '/users',
  asyncMiddleware(async (req: Request, res: Response) => {
    const users = await prisma.superfast_User.findMany({ include: { superfast_Role: true } });

    res.json({
      users: users.flatMap((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        isActive: user.isActive,
        role: {
          id: user.superfast_Role.id,
          name: user.superfast_Role.name,
          description: user.superfast_Role.description,
          adminAccess: user.superfast_Role.adminAccess,
        },
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      })),
    });
  })
);

export default app;
