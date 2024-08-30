import { Review } from '@prisma/client';
import { ContentStatus } from '../../persistence/content/content.entity.js';
import { ReviewStatus } from '../../persistence/review/review.entity.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ChangeReviewStatusService } from '../../services/changeReviewStatus.service.js';
import { ApproveReviewUseCaseSchemaType } from './approveReview.schema.js';

export class ApproveReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly changeReviewStatusService: ChangeReviewStatusService
  ) {}

  async execute(props: ApproveReviewUseCaseSchemaType, hasReadAllReview: boolean): Promise<Review> {
    const updatedReview = await this.prisma.$transaction(async (tx) => {
      const result = await this.changeReviewStatusService.execute(
        tx,
        props.reviewId,
        props.userId,
        ReviewStatus.Approve,
        ContentStatus.published,
        hasReadAllReview
      );

      return result;
    });

    return updatedReview.toResponse();
  }
}
