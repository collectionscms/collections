import express, { Request, Response } from 'express';
import { Readable } from 'stream';
import { FileNotFoundException } from '../../exceptions/storage/fileNotFound.js';
import { UnknownException } from '../../exceptions/storage/unknown.js';
import { logger } from '../../utilities/logger.js';
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
        filter: { fileNameDisk: { _eq: req.params.fileName } },
      })
      .then((data) => data[0]);

    if (!file) throw new FileNotFoundException('file_does_not_exist');

    const storage = getStorage(file.storage);
    const key = storage.key(file.fileNameDisk);

    const data = await storage.getBuffer(key);

    res.attachment(file.fileName);
    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Length', data.length);
    res.setHeader('Accept-Ranges', 'bytes');

    let isDataSent = false;
    const stream = new Readable({
      read() {
        this.push(data);
        this.push(null);
      },
    });

    stream.on('data', (chunk) => {
      isDataSent = true;
      res.write(chunk);
    });

    stream.on('end', () => {
      res.end();
    });

    stream.on('error', (e) => {
      logger.error(e, `Couldn't stream file ${req.params.fileName} to the client`);

      if (!isDataSent) {
        res.removeHeader('Content-Type');
        res.removeHeader('Content-Disposition');
        throw new UnknownException('internal_server_error');
      }
    });
  })
);

export const assets = router;
