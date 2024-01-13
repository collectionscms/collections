import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { multipartHandler } from '../middleware/multipartHandler.js';
import { FilesService } from '../services/files.js';

const router = express.Router();

router.post(
  '/files',
  asyncHandler(multipartHandler),
  asyncHandler(async (req: Request, res: Response) => {
    const keys = res.locals.savedFileKeys;

    const service = new FilesService(prisma);
    const file = await service.findFile(keys[0]);
    const url = assetPath(file.id);

    res.json({ file: { ...file, url } });
  })
);

router.get(
  '/files/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const service = new FilesService(prisma);
    const file = await service.findFile(id);
    const url = assetPath(file.id);

    res.json({ file: { ...file, url } });
  })
);

const assetPath = (id: string) => `${env.PUBLIC_SERVER_URL}/assets/${id}`;

export const files = router;
