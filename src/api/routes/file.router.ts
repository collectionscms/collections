import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { multipartHandler } from '../middlewares/multipartHandler.js';
import { FileEntity } from '../persistence/file/file.entity.js';
import { FileRepository } from '../persistence/file/file.repository.js';
import { ProjectRepository } from '../persistence/project/project.repository.js';
import { CreateFileUseCase } from '../useCases/file/createFile.useCase.js';
import { createFileUseCaseSchema } from '../useCases/file/createFile.useCase.schema.js';

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
      bypassPrisma,
      new FileRepository(),
      new ProjectRepository()
    );
    const response = await useCase.execute(validated.data.projectId ?? null, files);

    res.json(response);
  })
);

export const file = router;
