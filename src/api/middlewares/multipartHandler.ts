import Busboy from 'busboy';
import { RequestHandler } from 'express';
import sizeOf from 'image-size';
import { extension } from 'mime-types';
import { v4 } from 'uuid';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { logger } from '../../utilities/logger.js';
import { FileEntity } from '../persistence/file/file.entity.js';
import { FileService } from '../services/file.service.js';

export const multipartHandler: RequestHandler = (req, res, next) => {
  const projectId = res.projectRole?.id ?? null;
  const userId = res.user?.id ?? null;
  const busboy = Busboy({ headers: req.headers });
  const service = new FileService();

  let fileName = '';
  let type = '';
  let fileData: Buffer | null = null;
  let fileCount = 0;
  let files: FileEntity[] = [];

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

      const file = FileEntity.Construct({
        projectId,
        storage: env.STORAGE_DRIVER,
        fileName: fileName,
        fileNameDisk: `${projectId || userId}/${id}.${extension(type)}`,
        fileSize: fileData.byteLength,
        type: type,
        width,
        height,
      });
      files.push(file);

      await service.upload(fileData, file.fileNameDisk);

      tryDone();
    }
  });

  req.pipe(busboy);

  const tryDone = () => {
    if (fileCount === 0) return next(new InvalidPayloadException('no_file_req_body'));
    if (fileCount === files.length) {
      res.locals.files = files;
      return next();
    }
  };
};
