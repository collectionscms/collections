import { PrismaClient } from '@prisma/client';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';

export class UpdatePostUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly postRepository: PostRepository
  ) {}

  async execute(projectId: string, id: string, params: { status: string }): Promise<PostEntity> {
    const record = await this.postRepository.findOneById(this.prisma, projectId, id);

    const entity = PostEntity.Reconstruct({
      ...record.toPersistence(),
      ...params,
      publishedAt: params.status === 'published' ? new Date() : null,
      version: params.status === 'published' ? record.version() + 1 : record.version(),
    });

    const result = await this.prisma.$transaction(async (tx) => {
      const result = await this.postRepository.update(tx, entity);
      // todo add history
      return result;
    });

    return result;
  }
}
