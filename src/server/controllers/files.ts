import express, { Request, Response } from 'express';
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

    const raw = await getRawData(file.id);

    res.json({ file, raw });
  })
);

app.get(
  '/files/:id',
  permissionsHandler([{ collection: 'superfast_files', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const repository = new FilesRepository();
    const file = await repository.readOne(id);

    const raw = await getRawData(id);

    res.json({ file, raw });
  })
);

// Retrieves the raw data from a file.
// The raw data is retrieved from uploaded storage.
const getRawData = async (id: number): Promise<string> => {
  const repository = new FilesRepository();
  const file = await repository.readOne(id);

  const storage = getStorage(file.storage);
  const key = storage.key(file.fileNameDisk);
  return await storage.get(key);
};

export const files = app;
