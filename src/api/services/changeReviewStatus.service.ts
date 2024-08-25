import { UnexpectedException } from '../../exceptions/unexpected.js';
import { ContentStatusType } from '../persistence/content/content.entity.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentHistoryEntity } from '../persistence/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../persistence/contentHistory/contentHistory.repository.js';
import {
  ReviewEntity,
  ReviewStatusType,
  reviewStatus,
} from '../persistence/review/review.entity.js';
import { ReviewRepository } from '../persistence/review/review.repository.js';
import { ProjectPrismaType } from '../database/prisma/client';

export class ChangeReviewStatusService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(
    prisma: ProjectPrismaType,
    reviewId: string,
    userId: string,
    reviewStatusType: ReviewStatusType,
    statusType: ContentStatusType,
    hasReadAllReview: boolean
  ): Promise<ReviewEntity> {
    const review = hasReadAllReview
      ? await this.reviewRepository.findOne(prisma, reviewId)
      : await this.reviewRepository.findOwnOne(prisma, userId, reviewId);

    if (reviewStatusType === reviewStatus.Approve) {
      review.approve();
    } else if (reviewStatusType === reviewStatus.Close) {
      review.close();
    } else {
      throw new UnexpectedException();
    }

    const content = await this.contentRepository.findOneById(prisma, review.contentId);
    content.changeStatus({
      status: statusType,
      updatedById: userId,
    });
    await this.contentRepository.updateStatus(prisma, content);

    const contentHistory = ContentHistoryEntity.Construct({
      ...content.toResponse(),
    });
    await this.contentHistoryRepository.create(prisma, contentHistory);

    const updatedReview = await this.reviewRepository.updateStatus(prisma, review);
    return updatedReview;
  }
}
