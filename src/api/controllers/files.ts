import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { PrimaryKey } from '../database/schemas.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { multipartHandler } from '../middleware/multipartHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { FilesService } from '../services/files.js';

const router = express.Router();

router.post(
  '/files',
  asyncHandler(multipartHandler),
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const keys = res.locals.savedFileKeys;

    const service = new FilesService({ schema: req.schema });
    const file = await service.readOne(keys[0]);

    const url = assetPath(file.id);

    res.json({ file: { ...file, url } });
  })
);

router.get(
  '/files/:id',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const service = new FilesService({ schema: req.schema });
    const file = await service.readOne(id);

    const url = assetPath(file.id);

    res.json({ file: { ...file, url } });
  })
);

const assetPath = (id: PrimaryKey) => `${env.PUBLIC_SERVER_URL}/assets/${id}`;

export const files = router;
