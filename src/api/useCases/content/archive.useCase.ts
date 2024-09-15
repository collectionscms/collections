import { Content } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentStatus } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistence/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { ArchiveUseCaseSchemaType } from './archive.useCase.schema.js';

export class ArchiveUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute(props: ArchiveUseCaseSchemaType): Promise<Content> {
    const { id, userId } = props;

    const { content, createdBy } = await this.contentRepository.findOneById(this.prisma, id);
    const beforeContent = content.toPublishedContentResponse(createdBy);

    content.changeStatus({
      status: ContentStatus.archived,
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

    await this.webhookService.send(
      this.prisma,
      updatedContent.projectId,
      WebhookTriggerEvent.archive,
      {
        old: beforeContent,
        new: updatedContent.toPublishedContentResponse(createdBy),
      }
    );

    return updatedContent.toResponse();
  }
}
