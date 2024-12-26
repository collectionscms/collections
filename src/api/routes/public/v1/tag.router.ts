/* eslint-disable max-len */
import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../../../exceptions/invalidPayload.js';
import { projectPrisma } from '../../../database/prisma/client.js';
import { asyncHandler } from '../../../middlewares/asyncHandler.js';
import { authenticatedUser } from '../../../middlewares/auth.js';
import { validateAccess } from '../../../middlewares/validateAccess.js';
import { ContentTagRepository } from '../../../persistence/contentTag/contentTag.repository.js';
import { TagRepository } from '../../../persistence/tag/tag.repository.js';
import { GetTagPublishedListContentsUseCase } from '../../../useCases/tag/getTagPublishedListContents.useCase.js';
import { getTagPublishedListContentsUseCaseSchema } from '../../../useCases/tag/getTagPublishedListContents.useCase.schema.js';

const router = express.Router();

router.get(
  '/tags/:tagName/contents',
  authenticatedUser,
  validateAccess(['readPublishedPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getTagPublishedListContentsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      language: req.query?.language,
      tagName: req.params.tagName,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetTagPublishedListContentsUseCase(
      projectPrisma(validated.data.projectId),
      new TagRepository(),
      new ContentTagRepository()
    );
    const contents = await useCase.execute(validated.data);

    res.json({ contents });
  })
);

export const tag = router;
