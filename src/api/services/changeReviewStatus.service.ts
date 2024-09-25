import { UnexpectedException } from '../../exceptions/unexpected.js';
import { ProjectPrismaType } from '../database/prisma/client';
import { ContentStatusType } from '../persistence/content/content.entity.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../persistence/contentRevision/contentRevision.repository.js';
import {
  ReviewEntity,
  ReviewStatus,
  ReviewStatusType,
} from '../persistence/review/review.entity.js';
import { ReviewRepository } from '../persistence/review/review.repository.js';
import { content } from '../routes/content.router.js';

export class ChangeReviewStatusService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async execute(
    prisma: ProjectPrismaType,
    reviewId: string,
    userId: string,
    reviewStatusType: ReviewStatusType,
    statusType: ContentStatusType,
    hasReadAllReview: boolean
  ): Promise<ReviewEntity> {
    const { review } = hasReadAllReview
      ? await this.reviewRepository.findOneWithContentAndParticipant(prisma, reviewId)
      : await this.reviewRepository.findOwnOneWithContentAndParticipant(prisma, userId, reviewId);

    if (reviewStatusType === ReviewStatus.Approved) {
      review.approve();
    } else if (reviewStatusType === ReviewStatus.Closed) {
      review.close();
    } else {
      throw new UnexpectedException();
    }

    const { content } = await this.contentRepository.findOneById(prisma, review.contentId);
    content.changeStatus({
      status: statusType,
      updatedById: userId,
    });
    await this.contentRepository.updateStatus(prisma, content);

    const contentRevision = ContentRevisionEntity.Construct({
      ...content.toResponse(),
      contentId: content.id,
    });
    await this.contentRevisionRepository.create(prisma, contentRevision);

    const updatedReview = await this.reviewRepository.updateStatus(prisma, review);
    return updatedReview;
  }
}
