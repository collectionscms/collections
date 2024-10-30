import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { TagRepository } from '../persistence/tag/tag.repository.js';
import { GetTagsUseCase } from '../useCases/tag/getTags.useCase.js';
import { getTagsUseCaseSchema } from '../useCases/tag/getTags.useCase.schema.js';

const router = express.Router();

router.get(
  '/tags',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const validated = getTagsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetTagsUseCase(
      projectPrisma(validated.data.projectId),
      new TagRepository()
    );
    const tags = await useCase.execute(validated.data);

    res.json({ tags });
  })
);

export const tag = router;
