import { Review } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { ReviewRepository } from '../../persistence/review/review.repository.js';
import { ContentService } from '../../services/content.service.js';
import { ApproveReviewUseCaseSchemaType } from './approveReview.useCase.schema.js';

export class ApproveReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly reviewRepository: ReviewRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly contentService: ContentService
  ) {}

  async execute(
    { userId, reviewId }: ApproveReviewUseCaseSchemaType,
    hasReadAllReview: boolean
  ): Promise<Review> {
    const { review } = hasReadAllReview
      ? await this.reviewRepository.findOneWithContentAndParticipant(this.prisma, reviewId)
      : await this.reviewRepository.findOwnOneWithContentAndParticipant(
          this.prisma,
          userId,
          reviewId
        );
    review.approve();

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
    latestRevision.publish(userId);

    content.publish({
      slug: latestRevision.slug,
      title: latestRevision.title,
      body: latestRevision.body,
      bodyJson: latestRevision.bodyJson,
      bodyHtml: latestRevision.bodyHtml,
      excerpt: latestRevision.excerpt,
      metaTitle: latestRevision.metaTitle,
      metaDescription: latestRevision.metaDescription,
      coverUrl: latestRevision.coverUrl,
      currentVersion: latestRevision.version,
      updatedById: userId,
    });

    const isUniqueSlug = await this.contentService.isUniqueSlug(
      this.prisma,
      content.id,
      latestRevision.slug
    );
    if (!isUniqueSlug) {
      throw new RecordNotUniqueException('already_registered_post_slug');
    }

    const updatedReview = await this.prisma.$transaction(async (tx) => {
      await this.contentRevisionRepository.update(tx, latestRevision);
      await this.contentRepository.updateStatus(tx, content);
      const result = await this.reviewRepository.updateStatus(tx, review);

      return result;
    });

    return updatedReview.toResponse();
  }
}
