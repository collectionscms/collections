import express, { Request, Response } from 'express';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ProjectSettingsService } from '../services/projectSettings.js';

const router = express.Router();

router.get(
  '/project-settings',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new ProjectSettingsService(prisma);
    const projectSetting = await service.findProjectSetting();

    res.json({ projectSetting });
  })
);

router.patch(
  '/project-settings',
  // permissionsHandler([{ model: 'CollectionsProjectSettings', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new ProjectSettingsService(prisma);
    await service.update(req.body);

    res.status(204).end();
  })
);

export const projectSetting = router;
