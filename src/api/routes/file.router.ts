import { File } from '@prisma/client';
import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { FileRepository } from '../data/file/file.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { multipartHandler } from '../middlewares/multipartHandler.js';
import { CreateFileUseCase } from '../useCases/file/createFile.useCase.js';
import { GetFileUseCase } from '../useCases/file/getFile.useCase.js';
import { getFileUseCaseSchema } from '../useCases/file/getFileUse.schema.js';

const router = express.Router();

router.post(
  '/files',
  authenticatedUser,
  asyncHandler(multipartHandler),
  asyncHandler(async (_req: Request, res: Response) => {
    const files = res.locals.files as Omit<File, 'id'>[];
    const fileData = res.locals.fileData as Buffer;
    const projectId = res.user.projects[0].id;

    if (!files || files.length === 0 || !fileData) {
      throw new InvalidPayloadException('bad_request');
    }

    const useCase = new CreateFileUseCase(projectPrisma(projectId), fileData, new FileRepository());
    const response = await useCase.execute(files[0]);
    res.json(response);
  })
);

router.get(
  '/files/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = res.user.projects[0].id;

    const validated = getFileUseCaseSchema.safeParse({
      fileId: req.params.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetFileUseCase(projectPrisma(projectId), new FileRepository());
    const data = await useCase.execute(validated.data.fileId);
    res.json(data);
  })
);

export const file = router;
