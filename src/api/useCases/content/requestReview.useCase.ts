import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentStatus } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { ReviewEntity } from '../../persistence/review/review.entity.js';
import { ReviewRepository } from '../../persistence/review/review.repository.js';
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

    const contentWithRevisions = await this.contentRepository.findOneWithRevisionsById(
      this.prisma,
      id
    );
    const latestRevision = contentWithRevisions?.revisions[0];

    if (!contentWithRevisions || !latestRevision) {
      throw new RecordNotFoundException('record_not_found');
    }

    latestRevision.changeStatus({
      status: ContentStatus.review,
      updatedById: userId,
    });

    const updatedRevision = await this.prisma.$transaction(async (tx) => {
      let review = await this.reviewRepository.findOneByContentId(tx, id);
      if (review) {
        review.requestReview(comment);
      } else {
        review = ReviewEntity.Construct({
          projectId,
          postId: contentWithRevisions.content.postId,
          contentId: contentWithRevisions.content.id,
          revieweeId: userId,
          comment: comment as string,
        });
      }
      this.reviewRepository.upsert(tx, review);

      return await this.contentRevisionRepository.update(tx, latestRevision);
    });

    return updatedRevision.toContentResponse();
  }
}
