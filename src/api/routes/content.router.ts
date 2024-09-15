import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentHistoryRepository } from '../persistence/contentHistory/contentHistory.repository.js';
import { PostRepository } from '../persistence/post/post.repository.js';
import { ReviewRepository } from '../persistence/review/review.repository.js';
import { WebhookLogRepository } from '../persistence/webhookLog/webhookLog.repository.js';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository.js';
import { WebhookService } from '../services/webhook.service.js';
import { archiveUseCaseSchema } from '../useCases/content/archive.schema.js';
import { ArchiveUseCase } from '../useCases/content/archive.useCase.js';
import { publishUseCaseSchema } from '../useCases/content/publish.schema.js';
import { PublishUseCase } from '../useCases/content/publish.useCase.js';
import { requestReviewUseCaseSchema } from '../useCases/content/requestReview.schema.js';
import { RequestReviewUseCase } from '../useCases/content/requestReview.useCase.js';
import { trashContentUseCaseSchema } from '../useCases/content/trashContent.schema.js';
import { TrashContentUseCase } from '../useCases/content/trashContent.useCase.js';
import { updateContentUseCaseSchema } from '../useCases/content/updateContent.schema.js';
import { UpdateContentUseCase } from '../useCases/content/updateContent.useCase.js';

const router = express.Router();

router.patch(
  '/contents/:id',
  authenticatedUser,
  validateAccess(['updatePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateContentUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      id: req.params.id,
      userId: res.user.id,
      title: req.body.title,
      body: req.body.body,
      bodyJson: req.body.bodyJson,
      bodyHtml: req.body.bodyHtml,
      coverUrl: req.body.coverUrl,
      slug: req.body.slug,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new PostRepository(),
      new ContentHistoryRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.patch(
  '/contents/:id/request-review',
  authenticatedUser,
  validateAccess(['updatePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = requestReviewUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
      comment: req.body.comment,
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
      new ContentHistoryRepository(),
      new WebhookService(new WebhookSettingRepository(), new WebhookLogRepository())
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.patch(
  '/contents/:id/archive',
  authenticatedUser,
  validateAccess(['archivePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = archiveUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new ArchiveUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentHistoryRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.delete(
  '/contents/:id/trash',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = trashContentUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new TrashContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentHistoryRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const content = router;
