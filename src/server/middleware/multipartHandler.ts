import Busboy from 'busboy';
import { RequestHandler } from 'express';
import sizeOf from 'image-size';
import { extension } from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { File } from '../../config/types.js';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { FileService } from '../services/file.js';

export const multipartHandler: RequestHandler = (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });
  const service = new FileService();

  let fileCount = 0;
  let savedFileKeys: number[] = [];

  busboy.on('file', async (_name, stream, info) => {
    const { filename, mimeType } = info;

    stream.on('data', async (data: Buffer) => {
      fileCount++;

      const dimensions = sizeOf(data);

      const meta: Omit<File, 'id'> = {
        storage: env.STORAGE_DRIVER,
        fileName: filename,
        fileNameDisk: `${uuidv4()}.${extension(mimeType)}`,
        fileSize: data.byteLength,
        type: mimeType,
        width: dimensions.width ?? null,
        height: dimensions.height ?? null,
      };

      const key = await service.upload(data, meta);
      savedFileKeys.push(key);
      tryDone();
    });
  });

  busboy.on('error', (error: Error) => {
    req.unpipe(busboy);
    next(error);
  });

  busboy.on('close', () => {
    tryDone();
  });

  req.pipe(busboy);

  const tryDone = () => {
    if (fileCount === 0) throw new InvalidPayloadException('no_file_req_body');
    if (fileCount === savedFileKeys.length) {
      res.locals.savedFileKeys = savedFileKeys;
      return next();
    }
  };
};
