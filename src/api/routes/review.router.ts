import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../persistence/contentRevision/contentRevision.repository.js';
import { PermissionEntity } from '../persistence/permission/permission.entity.js';
import { ReviewRepository } from '../persistence/review/review.repository.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { WebhookLogRepository } from '../persistence/webhookLog/webhookLog.repository.js';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository.js';
import { ContentService } from '../services/content.service.js';
import { WebhookService } from '../services/webhook.service.js';
import { ApproveReviewUseCase } from '../useCases/review/approveReview.useCase.js';
import { approveReviewUseCaseSchema } from '../useCases/review/approveReview.useCase.schema.js';
import { CloseReviewUseCase } from '../useCases/review/closeReview.useCase.js';
import { closeReviewUseCaseSchema } from '../useCases/review/closeReview.useCase.schema.js';
import { GetReviewUseCase } from '../useCases/review/getReview.useCase.js';
import { getReviewUseCaseSchema } from '../useCases/review/getReview.useCase.schema.js';
import { GetReviewsUseCase } from '../useCases/review/getReviews.useCase.js';
import { getReviewsUseCaseSchema } from '../useCases/review/getReviews.useCase.schema.js';
import { ContentTagRepository } from '../persistence/contentTag/contentTag.repository.js';

const router = express.Router();

router.get(
  '/reviews',
  authenticatedUser,
  validateAccess(['readOwnReview', 'readAllReview']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getReviewsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      userId: res.user?.id,
      status: req.query.status,
      isAdmin: res.projectRole?.isAdmin,
      permissions: res.projectRole?.permissions,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetReviewsUseCase(
      projectPrisma(validated.data.projectId),
      new ReviewRepository()
    );

    const hasReadAllReview =
      validated.data.isAdmin ||
      PermissionEntity.hasPermission(validated.data.permissions, 'readAllReview');
    const reviews = await useCase.execute(validated.data, hasReadAllReview);

    res.json({
      reviews,
    });
  })
);

router.get(
  '/reviews/:id',
  authenticatedUser,
  validateAccess(['readOwnReview', 'readAllReview']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getReviewUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      userId: res.user?.id,
      reviewId: req.params.id,
      isAdmin: res.projectRole?.isAdmin,
      permissions: res.projectRole?.permissions,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetReviewUseCase(
      projectPrisma(validated.data.projectId),
      new ReviewRepository()
    );

    const hasReadAllReview =
      validated.data.isAdmin ||
      PermissionEntity.hasPermission(validated.data.permissions, 'readAllReview');
    const review = await useCase.execute(validated.data, hasReadAllReview);

    res.json({
      review,
    });
  })
);

router.patch(
  '/reviews/:id/close',
  authenticatedUser,
  validateAccess(['closeReview']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = closeReviewUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      userId: res.user?.id,
      reviewId: req.params.id,
      isAdmin: res.projectRole?.isAdmin,
      permissions: res.projectRole?.permissions,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CloseReviewUseCase(
      projectPrisma(validated.data.projectId),
      new ReviewRepository(),
      new ContentRepository(),
      new ContentRevisionRepository()
    );

    const hasReadAllReview =
      validated.data.isAdmin ||
      PermissionEntity.hasPermission(validated.data.permissions, 'readAllReview');
    await useCase.execute(validated.data, hasReadAllReview);

    res.status(204).end();
  })
);

router.patch(
  '/reviews/:id/approve',
  authenticatedUser,
  validateAccess(['approveReview']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = approveReviewUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      userId: res.user?.id,
      reviewId: req.params.id,
      isAdmin: res.projectRole?.isAdmin,
      permissions: res.projectRole?.permissions,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new ApproveReviewUseCase(
      projectPrisma(validated.data.projectId),
      new ReviewRepository(),
      new ContentRepository(),
      new ContentService(new ContentRepository(), new ContentRevisionRepository()),
      new WebhookService(
        new WebhookSettingRepository(),
        new WebhookLogRepository(),
        new UserRepository(),
        new ContentTagRepository()
      )
    );

    const hasReadAllReview =
      validated.data.isAdmin ||
      PermissionEntity.hasPermission(validated.data.permissions, 'readAllReview');
    await useCase.execute(validated.data, hasReadAllReview);

    res.status(204).end();
  })
);

export const review = router;
