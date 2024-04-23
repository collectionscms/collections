import { File } from '@prisma/client';
import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { FileRepository } from '../data/file/file.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { multipartHandler } from '../middleware/multipartHandler.js';
import { CreateFileUseCase } from '../useCases/file/createFile.useCase.js';
import { GetFileUseCase } from '../useCases/file/getFile.useCase.js';

const router = express.Router();

router.post(
  '/files',
  authenticatedUser,
  asyncHandler(multipartHandler),
  asyncHandler(async (_req: Request, res: Response) => {
    const files = res.locals.files as Omit<File, 'id'>[];
    const fileData = res.locals.fileData as Buffer;

    if (!files || files.length === 0 || !fileData) {
      throw new InvalidPayloadException('bad_request');
    }

    const useCase = new CreateFileUseCase(prisma, fileData, new FileRepository());
    const response = await useCase.execute(files[0]);
    res.json(response);
  })
);

router.get(
  '/files/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const useCase = new GetFileUseCase(prisma, new FileRepository());
    const data = await useCase.execute(id);
    res.json(data);
  })
);

export const file = router;
