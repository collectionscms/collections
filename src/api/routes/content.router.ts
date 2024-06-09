import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { ContentHistoryRepository } from '../data/contentHistory/contentHistory.repository.js';
import { ReviewRepository } from '../data/review/review.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { createContentUseCaseSchema } from '../useCases/content/createContent.schema.js';
import { CreateContentUseCase } from '../useCases/content/createContent.useCase.js';
import { publishUseCaseSchema } from '../useCases/content/publish.schema.js';
import { PublishUseCase } from '../useCases/content/publish.useCase.js';
import { requestReviewUseCaseSchema } from '../useCases/content/requestReview.schema.js';
import { RequestReviewUseCase } from '../useCases/content/requestReview.useCase.js';
import { updateContentUseCaseSchema } from '../useCases/content/updateContent.schema.js';
import { UpdateContentUseCase } from '../useCases/content/updateContent.useCase.js';

const router = express.Router();

router.post(
  '/posts/:id/contents',
  authenticatedUser,
  validateAccess(['createPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createContentUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      id: req.params.id,
      locale: req.body.locale,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository()
    );
    const content = await useCase.execute(validated.data);

    res.json({
      content,
    });
  })
);

router.patch(
  '/contents/:id',
  authenticatedUser,
  validateAccess(['updatePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateContentUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      id: req.params.id,
      userId: res.user.id,
      fileId: req.body.fileId,
      title: req.body.title,
      body: req.body.body,
      bodyJson: req.body.bodyJson,
      bodyHtml: req.body.bodyHtml,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.patch(
  '/contents/:id/requestReview',
  authenticatedUser,
  validateAccess(['updatePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = requestReviewUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
      title: req.body.title,
      body: req.body.body,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new RequestReviewUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentHistoryRepository(),
      new ReviewRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.patch(
  '/contents/:id/publish',
  authenticatedUser,
  validateAccess(['publishPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = publishUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new PublishUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentHistoryRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const content = router;
