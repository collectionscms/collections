import { Content } from '@prisma/client';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdateContentUseCaseSchemaType } from './updateContent.schema.js';

export class UpdateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(props: UpdateContentUseCaseSchemaType): Promise<Content> {
    const { id, userId, fileId, title, body, bodyJson, bodyHtml } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);

    const result = await this.prisma.$transaction(async (tx) => {
      const entity = ContentEntity.Reconstruct<Content, ContentEntity>(content.toResponse());
      entity.updateContent({
        fileId,
        title,
        body,
        bodyJson,
        bodyHtml,
        updatedById: userId,
      });
      const updatedContent = await this.contentRepository.update(this.prisma, entity);

      return updatedContent;
    });

    return result.toResponse();
  }
}
