import express, { Request, Response } from 'express';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { ProjectService } from '../services/project.js';

const router = express.Router();

router.get(
  '/projects',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const service = new ProjectService(prisma);
    const project = await service.findProject();

    res.json({ project });
  })
);

router.patch(
  '/projects',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const service = new ProjectService(prisma);
    await service.update(req.body);

    res.status(204).end();
  })
);

export const project = router;
