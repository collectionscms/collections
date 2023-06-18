import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { multipartHandler } from '../middleware/multipartHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { FilesRepository } from '../repositories/files.js';

const router = express.Router();

router.post(
  '/files',
  asyncHandler(multipartHandler),
  permissionsHandler([{ collection: 'superfast_files', action: 'create' }]),
  asyncHandler(async (_req: Request, res: Response) => {
    const keys = res.locals.savedFileKeys;

    const repository = new FilesRepository();
    const file = await repository.readOne(keys[0]);

    const url = assetPath(file.file_name_disk);

    res.json({ file: { ...file, url } });
  })
);

router.get(
  '/files/:id',
  permissionsHandler([{ collection: 'superfast_files', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const repository = new FilesRepository();
    const file = await repository.readOne(id);

    const url = assetPath(file.file_name_disk);

    res.json({ file: { ...file, url } });
  })
);

const assetPath = (fileNameDisk: string) => `${env.PUBLIC_SERVER_URL}/assets/${fileNameDisk}`;

export const files = router;
