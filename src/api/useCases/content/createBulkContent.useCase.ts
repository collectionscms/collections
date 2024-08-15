import { Content } from '@prisma/client';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ContentHistoryEntity } from '../../data/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../data/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CreateBulkContentUseCaseSchemaType } from './createBulkContent.schema.js';

export class CreateBulkContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: CreateBulkContentUseCaseSchemaType): Promise<Content[]> {
    const { projectId, postId, userId, languages } = props;

    const contents = await this.contentRepository.findManyByPostId(this.prisma, postId);

    const updatedContents = await this.prisma.$transaction(async (tx) => {
      const updatedContents = [];
      const histories = [];

      // create contents
      const addContents = languages.filter(
        (language) => !contents.find((content) => content.language === language)
      );
      for (const language of addContents) {
        const content = ContentEntity.Construct({
          projectId,
          postId,
          language,
          createdById: userId,
        });

        const result = await this.contentRepository.create(tx, content);
        updatedContents.push(result.content);

        const contentHistory = ContentHistoryEntity.Construct({
          ...result.content.toResponse(),
        });
        histories.push(contentHistory);
      }

      // create histories
      await this.contentHistoryRepository.createMany(tx, histories);

      return updatedContents;
    });

    return updatedContents.map((content) => content.toResponse());
  }
}
