import { PrismaClient } from '@prisma/client';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';

export class UpdateContentUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(
    id: string,
    projectId: string,
    params: { title: string; body: string; bodyJson: string; bodyHtml: string; locale: string }
  ): Promise<ContentEntity> {
    const record = await this.contentRepository.findOneById(this.prisma, id, projectId);
    const post = await this.postRepository.findOneById(
      this.prisma,
      record.projectId(),
      record.postId()
    );

    const result = await this.prisma.$transaction(async (tx) => {
      if (post.status() === 'init') {
        await this.postRepository.update(
          tx,
          PostEntity.Reconstruct({ ...post.toPersistence(), status: 'draft' })
        );
      }

      const entity = ContentEntity.Reconstruct({
        ...record.toPersistence(),
        ...params,
      });

      return await this.contentRepository.update(this.prisma, entity);
    });

    return result;
  }
}
