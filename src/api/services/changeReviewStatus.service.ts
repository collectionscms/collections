import { UnexpectedException } from '../../exceptions/unexpected.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { StatusType } from '../data/post/post.entity.js';
import { PostHistoryRepository } from '../data/postHistory/postHistory.repository.js';
import { ReviewEntity, ReviewStatusType, reviewStatus } from '../data/review/review.entity.js';
import { ReviewRepository } from '../data/review/review.repository';
import { ProjectPrismaType } from '../database/prisma/client';

export class ChangeReviewStatusService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly contentRepository: ContentRepository,
    private readonly postHistoryRepository: PostHistoryRepository
  ) {}

  async execute(
    prisma: ProjectPrismaType,
    reviewId: string,
    userId: string,
    reviewStatusType: ReviewStatusType,
    statusType: StatusType,
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

    // const postHistory = PostHistoryEntity.Construct({
    //   projectId: review.projectId,
    //   postId: post.id,
    //   userId: userId,
    //   status: post.status,
    //   version: post.version,
    // });
    // await this.postHistoryRepository.create(prisma, postHistory);

    const updatedReview = await this.reviewRepository.updateStatus(prisma, review);
    return updatedReview;
  }
}
