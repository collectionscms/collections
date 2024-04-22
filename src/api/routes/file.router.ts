import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { multipartHandler } from '../middleware/multipartHandler.js';
import { FileService } from '../services/file.service.js';

const router = express.Router();

router.post(
  '/files',
  authenticatedUser,
  asyncHandler(multipartHandler),
  asyncHandler(async (_req: Request, res: Response) => {
    const keys = res.locals.savedFileKeys;

    const service = new FileService(prisma);
    const file = await service.findFile(keys[0]);
    const url = assetPath(file.id);

    res.json({ file: { ...file, url } });
  })
);

router.get(
  '/files/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const service = new FileService(prisma);
    const file = await service.findFile(id);
    const url = assetPath(file.id);

    res.json({ file: { ...file, url } });
  })
);

const assetPath = (id: string) => `${env.PUBLIC_SERVER_URL}/assets/${id}`;

export const file = router;
