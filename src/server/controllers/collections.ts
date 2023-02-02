import asyncMiddleware from '../middleware/async';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const app = express();

app.get(
  '/collections',
  asyncMiddleware(async (req: Request, res: Response) => {
    const collections = await prisma.superfastCollection.findMany();

    res.json({
      collections: collections.flatMap((collection) => ({
        ...collection,
      })),
    });
  })
);

export default app;
