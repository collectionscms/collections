import { PrismaClient } from '@prisma/client';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { PostHistoryEntity } from '../../data/postHistory/postHistory.entity.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';

export class ChangeStatusUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly postRepository: PostRepository,
    private readonly postHistoryRepository: PostHistoryRepository
  ) {}

  async execute(
    id: string,
    projectId: string,
    userName: string,
    params: { status: string }
  ): Promise<PostEntity> {
    const post = await this.postRepository.findOneById(this.prisma, projectId, id);

    const postEntity = await this.prisma.$transaction(async (tx) => {
      const postEntity = PostEntity.Reconstruct({ ...post.toPersistence(), status: params.status });
      postEntity.beforeValidate();
      await this.postRepository.update(tx, projectId, postEntity);

      const postHistoryEntity = PostHistoryEntity.Construct({
        projectId: post.projectId,
        postId: post.id(),
        userName,
        status: params.status,
        version: post.version(),
      });
      postHistoryEntity.beforeValidate();
      await this.postHistoryRepository.create(tx, postHistoryEntity);

      return postEntity;
    });

    return postEntity;
  }
}
