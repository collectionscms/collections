import { Content } from '@prisma/client';
import { ContentStatus } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { ReviewEntity } from '../../persistence/review/review.entity.js';
import { ReviewRepository } from '../../persistence/review/review.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { RequestReviewUseCaseSchemaType } from './requestReview.useCase.schema.js';

export class RequestReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(props: RequestReviewUseCaseSchemaType): Promise<Content> {
    const { projectId, id, userId, comment } = props;

    const { content } = await this.contentRepository.findOneById(this.prisma, id);
    content.changeStatus({
      status: ContentStatus.review,
      updatedById: userId,
    });

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

      const contentRevision = ContentRevisionEntity.Construct({
        ...result.toResponse(),
      });
      await this.contentRevisionRepository.create(tx, contentRevision);

      return result;
    });

    return updatedContent.toResponse();
  }
}
