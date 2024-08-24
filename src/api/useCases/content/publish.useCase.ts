import { Content } from '@prisma/client';
import { contentStatus } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistence/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { PublishUseCaseSchemaType } from './publish.schema.js';

export class PublishUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: PublishUseCaseSchemaType): Promise<Content> {
    const { id, userId } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.changeStatus({
      status: contentStatus.published,
      updatedById: userId,
    });

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.updateStatus(tx, content);

      const contentHistory = ContentHistoryEntity.Construct({
        ...result.toResponse(),
      });
      await this.contentHistoryRepository.create(tx, contentHistory);

      // hard delete previous contents
      const previousContent = await this.contentRepository.findOneByPostIdAndLanguage(
        tx,
        result.id,
        result.postId,
        result.language
      );
      if (previousContent) {
        await this.contentRepository.hardDelete(tx, previousContent);
      }

      return result;
    });

    return updatedContent.toResponse();
  }
}
