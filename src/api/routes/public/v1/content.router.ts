import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../../../exceptions/invalidPayload.js';
import { projectPrisma } from '../../../database/prisma/client.js';
import { asyncHandler } from '../../../middlewares/asyncHandler.js';
import { authenticatedUser } from '../../../middlewares/auth.js';
import { validateAccess } from '../../../middlewares/validateAccess.js';
import { ContentRepository } from '../../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../../persistence/contentRevision/contentRevision.repository.js';
import { ContentTagRepository } from '../../../persistence/contentTag/contentTag.repository.js';
import { GetPublishedContentUseCase } from '../../../useCases/content/getPublishedContent.useCase.js';
import { getPublishedContentUseCaseSchema } from '../../../useCases/content/getPublishedContent.useCase.schema.js';

const router = express.Router();

router.get(
  '/contents/:slug',
  authenticatedUser,
  validateAccess(['readPublishedPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getPublishedContentUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      language: req.query?.language,
      slug: req.params.slug,
      draftKey: req.query?.draftKey,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPublishedContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentTagRepository(),
      new ContentRevisionRepository()
    );
    const content = await useCase.execute(validated.data);

    res.json({ content });
  })
);

export const content = router;
