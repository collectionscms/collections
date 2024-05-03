import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { PostHistoryEntity } from '../../data/postHistory/postHistory.entity.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';

export class UpdatePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly postHistoryRepository: PostHistoryRepository
  ) {}

  async execute(
    projectId: string,
    userName: string,
    id: string,
    params: { status: string }
  ): Promise<PostEntity> {
    const record = await this.postRepository.findOneById(this.prisma, projectId, id);

    const entity = PostEntity.Reconstruct({
      ...record.toPersistence(),
      ...params,
      publishedAt: params.status === 'published' ? new Date() : null,
      version: params.status === 'published' ? record.version + 1 : record.version,
    });

    const result = await this.prisma.$transaction(async (tx) => {
      const result = await this.postRepository.update(tx, projectId, entity);

      await this.postHistoryRepository.create(
        tx,
        PostHistoryEntity.Construct({
          projectId: result.projectId,
          postId: result.id,
          userName,
          status: params.status,
          version: result.version,
        })
      );

      return result;
    });

    return result;
  }
}
