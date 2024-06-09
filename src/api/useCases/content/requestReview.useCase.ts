import { Content } from '@prisma/client';
import { contentStatus } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';
import { ReviewEntity } from '../../data/review/review.entity.js';
import { ReviewRepository } from '../../data/review/review.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { RequestReviewUseCaseSchemaType } from './requestReview.schema.js';

export class RequestReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly postHistoryRepository: PostHistoryRepository,
    private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(props: RequestReviewUseCaseSchemaType): Promise<Content> {
    const { projectId, id, userId, title, body } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.changeStatus(contentStatus.review);

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.updateStatus(tx, content);

      let review = await this.reviewRepository.findOneByContentId(tx, id);
      if (review) {
        review.requestReview(title as string, body);
      } else {
        review = ReviewEntity.Construct({
          projectId,
          postId: content.postId,
          contentId: content.id,
          revieweeId: userId,
          title: title as string,
          body: body || null,
        });
      }
      this.reviewRepository.upsert(tx, review);

      // await this.postHistoryRepository.create(
      //   tx,
      //   PostHistoryEntity.Construct({
      //     projectId: projectId,
      //     postId: id,
      //     userId,
      //     status: entity.status,
      //     version: entity.version,
      //   })
      // );

      return result;
    });

    return updatedContent.toResponse();
  }
}
