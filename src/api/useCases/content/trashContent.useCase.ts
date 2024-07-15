import { Content } from '@prisma/client';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { TrashContentUseCaseSchemaType } from './trashContent.schema.js';

export class TrashContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(props: TrashContentUseCaseSchemaType): Promise<Content> {
    const { id } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.delete();
    const deletedContent = await this.contentRepository.delete(this.prisma, content);

    return deletedContent.toResponse();
  }
}
