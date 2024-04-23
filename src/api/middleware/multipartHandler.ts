import { File } from '@prisma/client';
import Busboy from 'busboy';
import { RequestHandler } from 'express';
import sizeOf from 'image-size';
import { extension } from 'mime-types';
import { v4 } from 'uuid';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { logger } from '../../utilities/logger.js';

export const multipartHandler: RequestHandler = (req, res, next) => {
  const projectId = req.res?.user.projects[0].id;
  if (!projectId) {
    throw new InvalidPayloadException('bad_request');
  }

  const busboy = Busboy({ headers: req.headers });

  let fileName = '';
  let type = '';
  let fileData: Buffer | null = null;
  let fileCount = 0;
  let files: Omit<File, 'id'>[] = [];

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
      const id = v4();

      try {
        const dimensions = sizeOf(fileData);
        width = dimensions.width ?? null;
        height = dimensions.height ?? null;
      } catch (err) {
        logger.info(err, `Couldn't get dimensions of file "${fileName}"`);
      }

      const file = {
        projectId,
        storage: env.STORAGE_DRIVER,
        fileName: fileName,
        fileNameDisk: `${id}.${extension(type)}`,
        fileSize: fileData.byteLength,
        type: type,
        width,
        height,
      };

      files.push(file);
      tryDone();
    }
  });

  req.pipe(busboy);

  const tryDone = () => {
    if (fileCount === 0) throw new InvalidPayloadException('no_file_req_body');
    if (fileCount === files.length) {
      res.locals.files = files;
      res.locals.fileData = fileData;
      return next();
    }
  };
};
