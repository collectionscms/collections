import express, { Request, Response } from 'express';
import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';

const app = express();

app.get(
  '/project_settings',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const projectSetting = await database('superfast_project_settings').first();
    res.json({ projectSetting: projectSetting });
  })
);

app.patch(
  '/project_settings',
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new InvalidCredentialsException('invalid_user_credentials');
    }

    const database = await getDatabase();
    await database('superfast_project_settings').first().update(req.body);

    res.status(204).end();
  })
);

export default app;
