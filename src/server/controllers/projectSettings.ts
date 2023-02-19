import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/project_settings',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const project_setting = await database('superfast_project_settings').first();
    res.json({ project_setting: project_setting });
  })
);

app.patch(
  '/project_settings',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    await database('superfast_project_settings').first().update(req.body);

    res.status(204).end();
  })
);

export default app;
