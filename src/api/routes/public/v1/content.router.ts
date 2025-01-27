import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../../../exceptions/invalidPayload.js';
import { projectPrisma } from '../../../database/prisma/client.js';
import { asyncHandler } from '../../../middlewares/asyncHandler.js';
import { authenticatedUser } from '../../../middlewares/auth.js';
import { validateAccess } from '../../../middlewares/validateAccess.js';
import { ContentRepository } from '../../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../../persistence/contentRevision/contentRevision.repository.js';
import { ContentTagRepository } from '../../../persistence/contentTag/contentTag.repository.js';
import { PostRepository } from '../../../persistence/post/post.repository.js';
import { GetPublishedContentUseCase } from '../../../useCases/content/getPublishedContent.useCase.js';
import { getPublishedContentUseCaseSchema } from '../../../useCases/content/getPublishedContent.useCase.schema.js';
import { UpdateContentUseCase } from '../../../useCases/public/content/updateContent.useCase.js';
import { updateContentUseCaseSchema } from '../../../useCases/public/content/updateContent.useCase.schema.js';

const router = express.Router();

router.get(
  '/contents/:identifier',
  authenticatedUser,
  validateAccess(['readPublishedPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getPublishedContentUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      language: req.query?.language,
      identifier: req.params.identifier,
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

router.patch(
  '/contents/:id',
  authenticatedUser,
  validateAccess(['savePostByApi']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateContentUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      id: req.params.id,
      title: req.body.title,
      subtitle: req.body.subtitle,
      body: req.body.body,
      bodyJson: req.body.bodyJson,
      bodyHtml: req.body.bodyHtml,
      coverUrl: req.body.coverUrl,
      slug: req.body.slug,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRevisionRepository(),
      new PostRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const content = router;
