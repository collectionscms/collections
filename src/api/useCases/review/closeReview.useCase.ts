import { Review } from '@prisma/client';
import { status } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { ReviewRepository } from '../../data/review/review.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CloseReviewUseCaseSchemaType } from './closeReview.schema.js';
import { PostHistoryEntity } from '../../data/postHistory/postHistory.entity.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';

export class CloseReviewUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly reviewRepository: ReviewRepository,
    private readonly postRepository: PostRepository,
    private readonly postHistoryRepository: PostHistoryRepository
  ) {}

  async execute(props: CloseReviewUseCaseSchemaType, hasReadAllReview: boolean): Promise<Review> {
    const review = hasReadAllReview
      ? await this.reviewRepository.findOne(this.prisma, props.reviewId)
      : await this.reviewRepository.findOwnOne(this.prisma, props.userId, props.reviewId);
    review.close();

    const post = await this.postRepository.findOneById(this.prisma, review.postId);
    post.updatePost(status.draft);

    const postHistory = PostHistoryEntity.Construct({
      projectId: post.projectId,
      postId: post.id,
      userId: props.userId,
      status: post.status,
      version: post.version,
    });

    const result = await this.prisma.$transaction(async (tx) => {
      await this.postRepository.update(tx, post);
      await this.postHistoryRepository.create(tx, postHistory);

      const updatedReview = await this.reviewRepository.updateStatus(tx, review);
      return updatedReview;
    });

    return result.toResponse();
  }
}
