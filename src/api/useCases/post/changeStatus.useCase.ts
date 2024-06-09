import { Post } from '@prisma/client';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { PostHistoryEntity } from '../../data/postHistory/postHistory.entity.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ChangeStatusUseCaseSchemaType } from './changeStatus.schema.js';

export class ChangeStatusUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly postHistoryRepository: PostHistoryRepository
  ) {}

  async execute(props: ChangeStatusUseCaseSchemaType): Promise<void> {
    const { projectId, id, userId, status } = props;

    const post = await this.postRepository.findOneById(this.prisma, id);
    const postEntity = PostEntity.Reconstruct<Post, PostEntity>(post.toPersistence());
    postEntity.changeStatus(status);

    await this.prisma.$transaction(async (tx) => {
      const updatedPost = await this.postRepository.updateStatus(tx, postEntity);

      // const postHistoryEntity = PostHistoryEntity.Construct({
      //   projectId: projectId,
      //   postId: id,
      //   userId,
      //   status,
      //   version: updatedPost.version,
      // });
      // await this.postHistoryRepository.create(tx, postHistoryEntity);

      return postEntity;
    });
  }
}
