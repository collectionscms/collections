import { Content } from '@prisma/client';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { ContentHistoryRepository } from '../../data/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdateContentUseCaseSchemaType } from './updateContent.schema.js';

export class UpdateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository,
    private readonly postHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: UpdateContentUseCaseSchemaType): Promise<Content> {
    const { id, projectId, userId, fileId, title, body, bodyJson, bodyHtml } = props;

    const record = await this.contentRepository.findOneById(this.prisma, id);
    const post = await this.postRepository.findOneById(this.prisma, record.postId);

    const result = await this.prisma.$transaction(async (tx) => {
      const entity = ContentEntity.Reconstruct<Content, ContentEntity>(record.toResponse());
      entity.updateContent({
        fileId,
        title,
        body,
        bodyJson,
        bodyHtml,
      });
      const content = await this.contentRepository.update(this.prisma, entity);

      return content;
    });

    return result.toResponse();
  }
}
