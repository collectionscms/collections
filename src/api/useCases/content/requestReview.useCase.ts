import { Content } from '@prisma/client';
import { contentStatus } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ContentHistoryEntity } from '../../data/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../data/contentHistory/contentHistory.repository.js';
import { ReviewEntity } from '../../data/review/review.entity.js';
import { ReviewRepository } from '../../data/review/review.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { RequestReviewUseCaseSchemaType } from './requestReview.schema.js';

export class RequestReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository,
    private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(props: RequestReviewUseCaseSchemaType): Promise<Content> {
    const { projectId, id, userId, comment } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.changeStatus(contentStatus.review);

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.updateStatus(tx, content);

      let review = await this.reviewRepository.findOneByContentId(tx, id);
      if (review) {
        review.requestReview(comment);
      } else {
        review = ReviewEntity.Construct({
          projectId,
          postId: content.postId,
          contentId: content.id,
          revieweeId: userId,
          comment: comment as string,
        });
      }
      this.reviewRepository.upsert(tx, review);

      const contentHistory = ContentHistoryEntity.Construct({
        projectId,
        contentId: content.id,
        userId,
        status: content.status,
        version: content.version,
      });
      await this.contentHistoryRepository.create(tx, contentHistory);

      return result;
    });

    return updatedContent.toResponse();
  }
}
