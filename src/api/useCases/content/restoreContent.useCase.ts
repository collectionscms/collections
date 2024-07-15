import { Content } from '@prisma/client';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { RestoreContentUseCaseSchemaType } from './restoreContent.schema.js';

export class RestoreContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute({ id }: RestoreContentUseCaseSchemaType): Promise<Content> {
    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.restore();

    const result = await this.contentRepository.updateStatus(this.prisma, content);
    return result.toResponse();
  }
}
