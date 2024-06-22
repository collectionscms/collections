import { UnexpectedException } from '../../exceptions/unexpected.js';
import { ContentStatusType } from '../data/content/content.entity.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { ContentHistoryEntity } from '../data/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../data/contentHistory/contentHistory.repository.js';
import { ReviewEntity, ReviewStatusType, reviewStatus } from '../data/review/review.entity.js';
import { ReviewRepository } from '../data/review/review.repository';
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
    content.changeStatus(statusType);
    await this.contentRepository.updateStatus(prisma, content);

    const contentHistory = ContentHistoryEntity.Construct({
      projectId: review.projectId,
      contentId: content.id,
      userId,
      status: content.status,
      version: content.version,
    });
    await this.contentHistoryRepository.create(prisma, contentHistory);

    const updatedReview = await this.reviewRepository.updateStatus(prisma, review);
    return updatedReview;
  }
}
