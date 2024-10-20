import { Review } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ReviewRepository } from '../../persistence/review/review.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { ContentService } from '../../services/content.service.js';
import { WebhookService } from '../../services/webhook.service.js';
import { ApproveReviewUseCaseSchemaType } from './approveReview.useCase.schema.js';

export class ApproveReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly reviewRepository: ReviewRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentService: ContentService,
    private readonly webhookService: WebhookService
  ) {}

  async execute(
    { userId, reviewId }: ApproveReviewUseCaseSchemaType,
    hasReadAllReview: boolean
  ): Promise<Review> {
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

    const { review } = reviewWithContent;
    review.approve();

    const contentWithRevisions = await this.contentRepository.findOneWithRevisionsById(
      this.prisma,
      review.contentId
    );

    if (!contentWithRevisions) {
      throw new RecordNotFoundException('record_not_found');
    }

    const { updatedContent, updatedReview } = await this.prisma.$transaction(async (tx) => {
      const updatedContent = await this.contentService.publish(
        tx,
        userId,
        contentWithRevisions.content,
        contentWithRevisions.revisions
      );
      const updatedReview = await this.reviewRepository.updateStatus(tx, review);

      return { updatedContent, updatedReview };
    });

    await this.webhookService.send(this.prisma, WebhookTriggerEvent.publish, updatedContent);

    return updatedReview.toResponse();
  }
}
