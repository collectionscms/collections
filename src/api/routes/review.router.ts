import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ReviewRepository } from '../data/review/review.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { getReviewUseCaseSchema } from '../useCases/review/getReview.schema.js';
import { GetReviewUseCase } from '../useCases/review/getReview.useCase.js';
import { getReviewsUseCaseSchema } from '../useCases/review/getReviews.schema.js';
import { GetReviewsUseCase } from '../useCases/review/getReviews.useCase.js';

const router = express.Router();

router.get(
  '/reviews',
  authenticatedUser,
  validateAccess(['readOwnReview']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getReviewsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      userId: res.user?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetReviewsUseCase(
      projectPrisma(validated.data.projectId),
      new ReviewRepository()
    );

    const permissions = res.projectRole?.role.permissions ?? [];
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
  validateAccess(['readOwnReview']),
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

    const permissions = res.projectRole?.role.permissions ?? [];
    const hasReadAllReview = permissions.map((p) => p.action).includes('readAllReview');
    const review = await useCase.execute(validated.data, hasReadAllReview);

    res.json({
      review,
    });
  })
);

export const review = router;
