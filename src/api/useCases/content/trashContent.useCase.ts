import { Content } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentStatus } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistence/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { TrashContentUseCaseSchemaType } from './trashContent.useCase.schema.js';

export class TrashContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute(props: TrashContentUseCaseSchemaType): Promise<Content> {
    const { id, userId } = props;

    const { content, createdBy } = await this.contentRepository.findOneById(this.prisma, id);

    content.delete(userId);

    const deletedContent = await this.prisma.$transaction(async (tx) => {
      const deletedContent = await this.contentRepository.delete(tx, content);

      const contentHistory = ContentHistoryEntity.Construct({
        ...content.toResponse(),
      });
      await this.contentHistoryRepository.create(tx, contentHistory);

      return deletedContent;
    });

    if (content.isPublished()) {
      await this.webhookService.send(
        this.prisma,
        content.projectId,
        WebhookTriggerEvent.deletePublished,
        {
          old: deletedContent.toPublishedContentResponse(createdBy),
          new: null,
        }
      );
    }

    return deletedContent.toResponse();
  }
}
