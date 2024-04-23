import express, { Request, Response } from 'express';
import { Readable } from 'stream';
import { UnknownException } from '../../exceptions/storage/unknown.js';
import { logger } from '../../utilities/logger.js';
import { FileRepository } from '../data/file/file.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { GetDataUseCase } from '../useCases/asset/getData.useCase.js';
import { getDataUseCaseSchema } from '../useCases/asset/getData.schema.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    res.redirect('/admin');
  })
);

router.get(
  '/assets/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getDataUseCaseSchema.safeParse({
      fileId: req.params.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetDataUseCase(prisma, new FileRepository());
    const { file, data } = await useCase.execute(validated.data.fileId);

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

export const asset = router;
