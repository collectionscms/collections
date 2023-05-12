import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { ProjectSettingsRepository } from '../repositories/projectSettings.js';

const router = express.Router();

router.get(
  '/project-settings',
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new ProjectSettingsRepository();
    const data = await repository.read();

    res.json({ projectSetting: data[0] });
  })
);

router.patch(
  '/project-settings',
  permissionsHandler([{ collection: 'superfast_project_settings', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new ProjectSettingsRepository();
    const data = await repository.read();

    await repository.update(data[0].id, req.body);
    res.status(204).end();
  })
);

export const projectSettings = router;
