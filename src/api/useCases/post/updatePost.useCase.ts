import { Post } from '@prisma/client';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { PostHistoryEntity } from '../../data/postHistory/postHistory.entity.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdatePostUseCaseSchemaType } from './updatePost.schema.js';

export class UpdatePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly postHistoryRepository: PostHistoryRepository
  ) {}

  async execute(props: UpdatePostUseCaseSchemaType): Promise<Post> {
    const { projectId, id, userId, status } = props;

    const record = await this.postRepository.findOneById(this.prisma, id);

    const entity = PostEntity.Reconstruct<Post, PostEntity>(record.toPersistence());
    entity.updatePost(status);

    const updatedPost = await this.prisma.$transaction(async (tx) => {
      const result = await this.postRepository.update(tx, entity);

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
