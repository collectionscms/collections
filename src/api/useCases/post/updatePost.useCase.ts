import { Post } from '@prisma/client';
import { InvalidPayloadException } from '../../../exceptions/invalidPayload.js';
import { PostEntity, status as statusType } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { PostHistoryEntity } from '../../data/postHistory/postHistory.entity.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';
import { ReviewEntity } from '../../data/review/review.entity.js';
import { ReviewRepository } from '../../data/review/review.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdatePostUseCaseSchemaType } from './updatePost.schema.js';

export class UpdatePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly postHistoryRepository: PostHistoryRepository,
    private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(props: UpdatePostUseCaseSchemaType): Promise<Post> {
    const { projectId, id, userId, status, title, body } = props;

    if (status === statusType.review && !title) {
      throw new InvalidPayloadException('bad_request');
    }

    const record = await this.postRepository.findOneById(this.prisma, id);

    const entity = PostEntity.Reconstruct<Post, PostEntity>(record.toPersistence());
    entity.changeStatus(status);

    const updatedPost = await this.prisma.$transaction(async (tx) => {
      const result = await this.postRepository.updateStatus(tx, entity);

      if (status === statusType.review) {
        let review = await this.reviewRepository.findOneByPostId(tx, id);
        if (review) {
          review.requestReview(title as string, body);
        } else {
          review = ReviewEntity.Construct({
            projectId,
            postId: id,
            revieweeId: userId,
            title: title as string,
            body: body || null,
          });
        }
        this.reviewRepository.upsert(tx, review);
      }

      await this.postHistoryRepository.create(
        tx,
        PostHistoryEntity.Construct({
          projectId: projectId,
          postId: id,
          userId,
          status: entity.status,
          version: entity.version,
        })
      );

      return result;
    });

    return updatedPost.toResponse();
  }
}
