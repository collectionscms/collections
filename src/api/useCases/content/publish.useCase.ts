import { Content } from '@prisma/client';
import { contentStatus } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ContentHistoryEntity } from '../../data/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../data/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { PublishUseCaseSchemaType } from './publish.schema.js';

export class PublishUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: PublishUseCaseSchemaType): Promise<Content> {
    const { id } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.changeStatus(contentStatus.published);

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.updateStatus(tx, content);

      const contentHistory = ContentHistoryEntity.Construct({
        ...result.toResponse(),
      });
      await this.contentHistoryRepository.create(tx, contentHistory);

      // hard delete previous contents
      const allContents = await this.contentRepository.findManyByPostId(
        this.prisma,
        content.postId
      );
      const prevContents = allContents.filter((c) => c.id !== result.id);
      for (const prevContent of prevContents) {
        await this.contentRepository.hardDelete(tx, prevContent);
      }

      return result;
    });

    return updatedContent.toResponse();
  }
}
