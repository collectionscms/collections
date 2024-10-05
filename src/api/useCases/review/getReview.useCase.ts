import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ReviewWithContentAndParticipant } from '../../../types/index.js';
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
  ): Promise<ReviewWithContentAndParticipant> {
    const reviewWithContent = hasReadAllReview
      ? await this.reviewRepository.findOneWithContentAndParticipant(this.prisma, props.reviewId)
      : await this.reviewRepository.findOwnOneWithContentAndParticipant(
          this.prisma,
          props.userId,
          props.reviewId
        );

    if (!reviewWithContent) {
      throw new RecordNotFoundException('record_not_found');
    }

    return {
      ...reviewWithContent.review.toResponse(),
      content: reviewWithContent.content.toResponse(),
      revieweeName: reviewWithContent.reviewee.name,
      reviewerName: reviewWithContent.reviewer?.name ?? null,
    };
  }
}
