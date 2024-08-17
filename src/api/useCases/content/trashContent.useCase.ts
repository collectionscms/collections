import { Content } from '@prisma/client';
import { ContentRepository } from '../../persistences/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistences/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistences/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { TrashContentUseCaseSchemaType } from './trashContent.schema.js';

export class TrashContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: TrashContentUseCaseSchemaType): Promise<Content> {
    const { id, userId } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.delete(userId);

    const deletedContent = await this.prisma.$transaction(async (tx) => {
      const deletedContent = await this.contentRepository.delete(tx, content);

      const contentHistory = ContentHistoryEntity.Construct({
        ...content.toResponse(),
      });
      await this.contentHistoryRepository.create(tx, contentHistory);

      return deletedContent;
    });

    return deletedContent.toResponse();
  }
}
