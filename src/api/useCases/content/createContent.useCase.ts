import { Content } from '@prisma/client';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ContentHistoryEntity } from '../../data/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../data/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CreateContentUseCaseSchemaType } from './createContent.schema.js';

export class CreateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: CreateContentUseCaseSchemaType): Promise<Content> {
    const entity = ContentEntity.Construct({
      projectId: props.projectId,
      postId: props.id,
      locale: props.locale,
      createdById: props.userId,
    });

    const createdContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.create(this.prisma, entity);

      const contentHistory = ContentHistoryEntity.Construct({
        ...result.content.toResponse(),
      });
      await this.contentHistoryRepository.create(tx, contentHistory);

      return result;
    });

    return createdContent.content.toResponse();
  }
}
