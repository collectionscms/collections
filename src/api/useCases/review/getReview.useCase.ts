import { Review } from '@prisma/client';
import { ReviewRepository } from '../../persistence/review/review.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetReviewUseCaseSchemaType } from './getReview.schema.js';

export class GetReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(props: GetReviewUseCaseSchemaType, hasReadAllReview: boolean): Promise<Review> {
    const record = hasReadAllReview
      ? await this.reviewRepository.findOne(this.prisma, props.reviewId)
      : await this.reviewRepository.findOwnOne(this.prisma, props.userId, props.reviewId);
    return record.toResponse();
  }
}
