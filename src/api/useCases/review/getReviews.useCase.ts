import { Review } from '@prisma/client';
import { ReviewRepository } from '../../persistence/review/review.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetReviewsUseCaseSchemaType } from './getReviews.schema.js';

export class GetReviewsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(props: GetReviewsUseCaseSchemaType, hasReadAllReview: boolean): Promise<Review[]> {
    const records = hasReadAllReview
      ? await this.reviewRepository.findMany(this.prisma)
      : await this.reviewRepository.findOwnMany(this.prisma, props.userId);
    return records.map((record) => record.toResponse());
  }
}
