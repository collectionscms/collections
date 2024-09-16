import { Content } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistence/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { WebhookService } from '../../services/webhook.service.js';
import { TrashPostUseCaseSchemaType } from './trashPost.useCase.schema.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';

export class TrashPostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute({ id, userId }: TrashPostUseCaseSchemaType): Promise<Content[]> {
    const contents = await this.contentRepository.findManyByPostId(this.prisma, id);

    const deletedContents = await this.prisma.$transaction(async (tx) => {
      const result = [];
      for (const { content, createdBy } of contents) {
        content.delete(userId);
        await this.contentRepository.delete(tx, content);
        result.push({ content, createdBy });

        const contentHistory = ContentHistoryEntity.Construct({
          ...content.toResponse(),
        });
        await this.contentHistoryRepository.create(tx, contentHistory);
      }

      return result;
    });

    const publishedContents = deletedContents.filter(({ content }) => content.isPublished());
    for (const { content, createdBy } of publishedContents) {
      await this.webhookService.send(
        this.prisma,
        content.projectId,
        WebhookTriggerEvent.deletePublished,
        {
          old: content.toPublishedContentResponse(createdBy),
          new: null,
        }
      );
    }

    return deletedContents.map(({ content }) => content.toResponse());
  }
}
