import express, { Request, Response, raw } from 'express';
import { pathList } from '../../utilities/pathList.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { multipartHandler } from '../middleware/multipartHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { FilesRepository } from '../repositories/files.js';
import { getStorage } from '../storages/storage.js';

const app = express();

app.post(
  '/files',
  asyncHandler(multipartHandler),
  permissionsHandler([{ collection: 'superfast_files', action: 'create' }]),
  asyncHandler(async (_req: Request, res: Response) => {
    const keys = res.locals.savedFileKeys;

    const repository = new FilesRepository();
    const file = await repository.readOne(keys[0]);

    const path = pathList.storageRoot(file.fileNameDisk);

    const storage = getStorage();
    const raw = await storage.get(path);

    res.status(200).json({ file, raw });
  })
);

export const files = app;
