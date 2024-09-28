import { Review } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { ReviewRepository } from '../../persistence/review/review.repository.js';
import { CloseReviewUseCaseSchemaType } from './closeReview.useCase.schema.js';

export class CloseReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly reviewRepository: ReviewRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async execute(
    { userId, reviewId }: CloseReviewUseCaseSchemaType,
    hasReadAllReview: boolean
  ): Promise<Review> {
    const { review } = hasReadAllReview
      ? await this.reviewRepository.findOneWithContentAndParticipant(this.prisma, reviewId)
      : await this.reviewRepository.findOwnOneWithContentAndParticipant(
          this.prisma,
          userId,
          reviewId
        );
    review.close();

    const contentWithRevisions = await this.contentRepository.findOneWithRevisionsById(
      this.prisma,
      review.contentId
    );

    if (!contentWithRevisions) {
      throw new RecordNotFoundException('record_not_found');
    }

    const { content, revisions } = contentWithRevisions;

    const latestRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
      revisions,
      content.language
    );
    latestRevision.draft();

    content.draft(userId);

    const updatedReview = await this.prisma.$transaction(async (tx) => {
      await this.contentRevisionRepository.update(tx, latestRevision);
      await this.contentRepository.updateStatus(tx, content);
      const result = await this.reviewRepository.updateStatus(tx, review);

      return result;
    });

    return updatedReview.toResponse();
  }
}
