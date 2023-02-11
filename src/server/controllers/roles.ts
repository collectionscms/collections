import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/roles',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = getDatabase();
    const roles = await database('superfast_roles');
    res.json({ roles: roles });
  })
);

export default app;
