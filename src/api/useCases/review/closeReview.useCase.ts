import { ContentRevision, Review } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { ReviewRepository } from '../../persistence/review/review.repository.js';
import { CloseReviewUseCaseSchemaType } from './closeReview.useCase.schema.js';

export class CloseReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly reviewRepository: ReviewRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async execute(
    { userId, reviewId }: CloseReviewUseCaseSchemaType,
    hasReadAllReview: boolean
  ): Promise<{
    revision: ContentRevision;
    review: Review;
  }> {
    const reviewWithContent = hasReadAllReview
      ? await this.reviewRepository.findOneWithContentAndParticipant(this.prisma, reviewId)
      : await this.reviewRepository.findOwnOneWithContentAndParticipant(
          this.prisma,
          userId,
          reviewId
        );

    if (!reviewWithContent) {
      throw new RecordNotFoundException('record_not_found');
    }

    const { review, content } = reviewWithContent;
    const latestRevision = await this.contentRevisionRepository.findLatestOneByContentId(
      this.prisma,
      content.id
    );

    if (!latestRevision) {
      throw new RecordNotFoundException('record_not_found');
    }

    review.close();
    latestRevision.draft();

    const updatedReview = await this.prisma.$transaction(async (tx) => {
      await this.contentRevisionRepository.update(tx, latestRevision);
      const closedReview = await this.reviewRepository.updateStatus(tx, review);

      return { revision: latestRevision, review: closedReview };
    });

    return {
      revision: updatedReview.revision.toResponse(),
      review: updatedReview.review.toResponse(),
    };
  }
}
