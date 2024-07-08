import { Content } from '@prisma/client';
import { ContentEntity, contentStatus } from '../../data/content/content.entity.js';
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
    const { projectId, postId, userId, locales } = props;

    const contents = await this.contentRepository.findManyByPostId(this.prisma, postId);

    const updatedContents = await this.prisma.$transaction(async (tx) => {
      const updatedContents = [];
      const histories = [];

      // delete contents
      const excludedContents = contents.filter((content) => !locales.includes(content.locale));
      for (const content of excludedContents) {
        content.changeStatus(contentStatus.trashed);

        const result = await this.contentRepository.updateStatus(tx, content);
        updatedContents.push(result);

        const contentHistory = ContentHistoryEntity.Construct({
          projectId,
          contentId: content.id,
          userId,
          status: content.status,
          version: content.version,
        });
        histories.push(contentHistory);
      }

      // create contents
      const addContents = locales.filter(
        (locale) => !contents.find((content) => content.locale === locale)
      );
      for (const locale of addContents) {
        const content = ContentEntity.Construct({
          projectId,
          postId,
          locale,
          createdById: userId,
        });

        const result = await this.contentRepository.create(tx, content);
        updatedContents.push(result.content);

        const contentHistory = ContentHistoryEntity.Construct({
          projectId,
          contentId: content.id,
          userId,
          status: content.status,
          version: content.version,
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
