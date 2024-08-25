import { Content } from '@prisma/client';
import { contentStatus } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistence/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ArchiveUseCaseSchemaType } from './archive.schema.js';

export class ArchiveUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: ArchiveUseCaseSchemaType): Promise<Content> {
    const { id, userId } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.changeStatus({
      status: contentStatus.archived,
      updatedById: userId,
    });

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.updateStatus(tx, content);

      const contentHistory = ContentHistoryEntity.Construct({
        ...result.toResponse(),
      });
      await this.contentHistoryRepository.create(tx, contentHistory);

      return result;
    });

    return updatedContent.toResponse();
  }
}
