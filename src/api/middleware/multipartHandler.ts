import { File } from '@prisma/client';
import Busboy from 'busboy';
import { RequestHandler } from 'express';
import sizeOf from 'image-size';
import { extension } from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { logger } from '../../utilities/logger.js';
import { prisma } from '../database/prisma/client.js';
import { FileService } from '../services/file.js';

export const multipartHandler: RequestHandler = (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });
  const service = new FileService(prisma);

  let fileName = '';
  let type = '';
  let fileData: Buffer | null = null;
  let fileCount = 0;
  let savedFileKeys: string[] = [];

  busboy.on('file', async (_name, stream, info) => {
    const { filename, mimeType } = info;
    fileName = filename;
    type = mimeType;
    fileCount++;

    stream.on('data', async (data: Buffer) => {
      if (fileData === null) {
        fileData = data;
      } else {
        fileData = Buffer.concat([fileData, data]);
      }
    });
  });

  busboy.on('error', (error: Error) => {
    req.unpipe(busboy);
    next(error);
  });

  busboy.on('finish', async () => {
    if (fileData) {
      let width = null;
      let height = null;
      const id = uuidv4();

      try {
        const dimensions = sizeOf(fileData);
        width = dimensions.width ?? null;
        height = dimensions.height ?? null;
      } catch (err) {
        logger.info(err, `Couldn't get dimensions of file "${fileName}"`);
      }

      const meta: File = {
        id,
        // todo
        projectId: '',
        storage: env.STORAGE_DRIVER,
        fileName: fileName,
        fileNameDisk: `${id}.${extension(type)}`,
        fileSize: fileData.byteLength,
        type: type,
        width,
        height,
      };

      const file = await service.upload(fileData, meta);
      savedFileKeys.push(file.id);
      tryDone();
    }
  });

  req.pipe(busboy);

  const tryDone = () => {
    if (fileCount === 0) throw new InvalidPayloadException('no_file_req_body');
    if (fileCount === savedFileKeys.length) {
      res.locals.savedFileKeys = savedFileKeys;
      res.locals.fileData = fileData;
      return next();
    }
  };
};
