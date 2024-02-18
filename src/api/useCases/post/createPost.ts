import { PrismaClient } from '@prisma/client';
import { LocalizedPost } from '../../../types/index.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';

export class CreatePostUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(projectId: string, userId: string, locale: string): Promise<LocalizedPost> {
    let record = await this.postRepository.findInit(this.prisma, projectId, userId);
    if (!record) {
      const { post, content } = PostEntity.Construct({
        projectId,
        defaultLocale: locale,
        createdById: userId,
      });

      record = await this.prisma.$transaction(async (tx) => {
        const result = await this.postRepository.create(tx, post);
        const contentEntity = await this.contentRepository.create(tx, content);

        return {
          post: result.post,
          contents: [contentEntity],
          createdBy: result.createdBy,
        };
      });
    }

    return record.post.toResponse(locale, record.contents, record.createdBy);
  }
}
