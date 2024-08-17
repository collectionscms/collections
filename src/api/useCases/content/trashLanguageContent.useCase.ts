import { Content } from '@prisma/client';
import { ContentRepository } from '../../persistences/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistences/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistences/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { TrashLanguageContentUseCaseSchemaType } from './trashLanguageContent.schema.js';

export class TrashLanguageContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: TrashLanguageContentUseCaseSchemaType): Promise<Content[]> {
    const { postId, userId, language } = props;
    const contents = await this.contentRepository.findManyByPostIdAndLanguage(
      this.prisma,
      postId,
      language
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
