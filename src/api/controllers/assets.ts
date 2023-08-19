import express, { Request, Response } from 'express';
import { FileNotFoundException } from '../../exceptions/storage/fileNotFound.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { FilesService } from '../services/files.js';
import { getStorage } from '../storages/storage.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    res.redirect('/admin');
  })
);

router.get(
  '/assets/:fileName',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new FilesService({ schema: req.schema });

    const file = await service
      .readMany({
        filter: { file_name_disk: { _eq: req.params.fileName } },
      })
      .then((data) => data[0]);

    if (!file) throw new FileNotFoundException('file_does_not_exist');

    const storage = getStorage(file.storage);
    const key = storage.key(file.file_name_disk);

    const data = await storage.getBuffer(key);

    res.type(file.type);
    res.setHeader('Content-Length', data.length);
    res.setHeader('Content-Disposition', 'attachment; filename=' + file.file_name);
    res.send(data);
  })
);

export const assets = router;
