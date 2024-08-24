import express, { Request, Response } from 'express';
import { Readable } from 'stream';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { UnknownException } from '../../exceptions/storage/unknown.js';
import { logger } from '../../utilities/logger.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { FileRepository } from '../persistences/file/file.repository.js';
import { ProjectRepository } from '../persistences/project/project.repository.js';
import { getDataUseCaseSchema } from '../useCases/asset/getData.schema.js';
import { GetDataUseCase } from '../useCases/asset/getData.useCase.js';
import { GetProjectFromSubdomainUseCase } from '../useCases/asset/getProjectFromSubdomain.useCase.js';

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
      subdomain: req.subdomains[0],
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const projectUseCase = new GetProjectFromSubdomainUseCase(
      bypassPrisma,
      new ProjectRepository()
    );
    const project = await projectUseCase.execute(validated.data.subdomain);

    const useCase = new GetDataUseCase(bypassPrisma, new FileRepository());
    const { file, data } = await useCase.execute(project?.id ?? null, validated.data.fileId);

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
