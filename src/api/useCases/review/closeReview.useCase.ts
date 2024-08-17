import { Review } from '@prisma/client';
import { contentStatus } from '../../persistences/content/content.entity.js';
import { reviewStatus } from '../../persistences/review/review.entity.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ChangeReviewStatusService } from '../../services/changeReviewStatus.service.js';
import { CloseReviewUseCaseSchemaType } from './closeReview.schema.js';

export class CloseReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly changeReviewStatusService: ChangeReviewStatusService
  ) {}

  async execute(props: CloseReviewUseCaseSchemaType, hasReadAllReview: boolean): Promise<Review> {
    const updatedReview = await this.prisma.$transaction(async (tx) => {
      const result = await this.changeReviewStatusService.execute(
        tx,
        props.reviewId,
        props.userId,
        reviewStatus.Close,
        contentStatus.draft,
        hasReadAllReview
      );

      return result;
    });

    return updatedReview.toResponse();
  }
}
