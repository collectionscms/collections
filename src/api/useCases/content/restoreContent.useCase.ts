import { Content } from '@prisma/client';
import { ConflictException } from '../../../exceptions/conflict.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { RestoreContentUseCaseSchemaType } from './restoreContent.schema.js';

export class RestoreContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute({ id, userId }: RestoreContentUseCaseSchemaType): Promise<Content> {
    const content = await this.contentRepository.findOneById(this.prisma, id);
    const post = await this.postRepository.findOneWithContentsById(this.prisma, content.postId);

    const sameLanguageContent = post.contents.find((c) => c.content.language === content.language);
    if (sameLanguageContent) {
      throw new ConflictException('already_has_same_language_content');
    }

    content.restore(userId);

    const result = await this.contentRepository.restore(this.prisma, content);
    return result.toResponse();
  }
}
