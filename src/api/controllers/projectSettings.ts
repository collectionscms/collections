import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { ProjectSettingsService } from '../services/projectSettings.js';

const router = express.Router();

router.get(
  '/project-settings',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new ProjectSettingsService({
      schema: req.schema,
    });
    const data = await service.readMany();

    res.json({ project_setting: data[0] });
  })
);

router.patch(
  '/project-settings',
  permissionsHandler([{ model: 'collections_project_settings', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new ProjectSettingsService({
      schema: req.schema,
    });
    const data = await service.readMany();

    await service.updateOne(data[0].id, req.body);

    res.status(204).end();
  })
);

export const projectSettings = router;
