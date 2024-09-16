import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentHistoryRepository } from '../persistence/contentHistory/contentHistory.repository.js';
import { ReviewRepository } from '../persistence/review/review.repository.js';
import { ChangeReviewStatusService } from '../services/changeReviewStatus.service.js';
import { approveReviewUseCaseSchema } from '../useCases/review/approveReview.useCase.schema.js';
import { ApproveReviewUseCase } from '../useCases/review/approveReview.useCase.js';
import { closeReviewUseCaseSchema } from '../useCases/review/closeReview.useCase.schema.js';
import { CloseReviewUseCase } from '../useCases/review/closeReview.useCase.js';
import { getReviewUseCaseSchema } from '../useCases/review/getReview.useCase.schema.js';
import { GetReviewUseCase } from '../useCases/review/getReview.useCase.js';
import { getReviewsUseCaseSchema } from '../useCases/review/getReviews.useCase.schema.js';
import { GetReviewsUseCase } from '../useCases/review/getReviews.useCase.js';

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
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetReviewsUseCase(
      projectPrisma(validated.data.projectId),
      new ReviewRepository()
    );

    const permissions = res.projectRole?.permissions ?? [];
    const hasReadAllReview = permissions.map((p) => p.action).includes('readAllReview');
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
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetReviewUseCase(
      projectPrisma(validated.data.projectId),
      new ReviewRepository()
    );

    const permissions = res.projectRole?.permissions ?? [];
    const hasReadAllReview = permissions.map((p) => p.action).includes('readAllReview');
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
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CloseReviewUseCase(
      projectPrisma(validated.data.projectId),
      new ChangeReviewStatusService(
        new ReviewRepository(),
        new ContentRepository(),
        new ContentHistoryRepository()
      )
    );

    const permissions = res.projectRole?.permissions ?? [];
    const hasReadAllReview = permissions.map((p) => p.action).includes('readAllReview');
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
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new ApproveReviewUseCase(
      projectPrisma(validated.data.projectId),
      new ChangeReviewStatusService(
        new ReviewRepository(),
        new ContentRepository(),
        new ContentHistoryRepository()
      )
    );

    const permissions = res.projectRole?.permissions ?? [];
    const hasReadAllReview = permissions.map((p) => p.action).includes('readAllReview');
    await useCase.execute(validated.data, hasReadAllReview);

    res.status(204).end();
  })
);

export const review = router;
