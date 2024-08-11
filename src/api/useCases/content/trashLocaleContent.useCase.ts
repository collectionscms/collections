import { Content } from '@prisma/client';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ContentHistoryEntity } from '../../data/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../data/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { TrashLocaleContentUseCaseSchemaType } from './trashLocaleContent.schema.js';

export class TrashLocaleContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: TrashLocaleContentUseCaseSchemaType): Promise<Content[]> {
    const { postId, projectId, userId, locale } = props;
    const contents = await this.contentRepository.findManyByPostIdAndLocale(
      this.prisma,
      postId,
      locale
    );

    const deletedContents = await this.prisma.$transaction(async (tx) => {
      const result = [];
      for (const content of contents) {
        content.delete(userId);
        const deletedContent = await this.contentRepository.delete(tx, content);
        result.push(deletedContent);

        const contentHistory = ContentHistoryEntity.Construct({
          ...content.toResponse(),
        });
        await this.contentHistoryRepository.create(tx, contentHistory);
      }

      return result;
    });

    return deletedContents.map((content) => content.toResponse());
  }
}
