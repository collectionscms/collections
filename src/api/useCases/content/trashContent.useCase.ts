import { Content } from '@prisma/client';
import { contentStatus } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ContentHistoryEntity } from '../../data/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../data/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { TrashContentUseCaseSchemaType } from './trashContent.schema.js';

export class TrashContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: TrashContentUseCaseSchemaType): Promise<Content> {
    const { projectId, id, userId } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.changeStatus(contentStatus.trashed);

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.updateStatus(tx, content);

      const contentHistory = ContentHistoryEntity.Construct({
        projectId,
        contentId: content.id,
        userId,
        status: content.status,
        version: content.version,
      });
      await this.contentHistoryRepository.create(tx, contentHistory);

      return result;
    });

    return updatedContent.toResponse();
  }
}
