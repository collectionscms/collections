import { ReviewWithParticipant } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ReviewRepository } from '../../persistence/review/review.repository.js';
import { GetReviewUseCaseSchemaType } from './getReview.useCase.schema.js';

export class GetReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(
    props: GetReviewUseCaseSchemaType,
    hasReadAllReview: boolean
  ): Promise<ReviewWithParticipant> {
    const record = hasReadAllReview
      ? await this.reviewRepository.findOne(this.prisma, props.reviewId)
      : await this.reviewRepository.findOwnOne(this.prisma, props.userId, props.reviewId);

    return {
      ...record.review.toResponse(),
      revieweeName: record.reviewee.name,
      reviewerName: record.reviewer?.name ?? null,
    };
  }
}
