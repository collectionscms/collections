import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { FileEntity } from '../persistences/file/file.entity.js';
import { FileRepository } from '../persistences/file/file.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { multipartHandler } from '../middlewares/multipartHandler.js';
import { createFileUseCaseSchema } from '../useCases/file/createFile.schema.js';
import { CreateFileUseCase } from '../useCases/file/createFile.useCase.js';
import { GetFileUseCase } from '../useCases/file/getFile.useCase.js';
import { getFileUseCaseSchema } from '../useCases/file/getFileUse.schema.js';

const router = express.Router();

router.post(
  '/files',
  authenticatedUser,
  asyncHandler(multipartHandler),
  asyncHandler(async (_req: Request, res: Response) => {
    const files = res.locals.files as FileEntity[];

    const validated = createFileUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);
    if (!files || files.length === 0) throw new InvalidPayloadException('bad_request');

    const useCase = new CreateFileUseCase(
      projectPrisma(validated.data.projectId),
      new FileRepository()
    );
    const response = await useCase.execute(files);

    res.json(response);
  })
);

router.get(
  '/files/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getFileUseCaseSchema.safeParse({
      fileId: req.params.id,
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetFileUseCase(projectPrisma(validated.data.fileId), new FileRepository());
    const data = await useCase.execute(validated.data.fileId);

    res.json(data);
  })
);

export const file = router;
