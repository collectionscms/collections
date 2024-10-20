import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { ContentService } from '../../services/content.service.js';
import { WebhookService } from '../../services/webhook.service.js';
import { PublishUseCaseSchemaType } from './publish.useCase.schema.js';

export class PublishUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentService: ContentService,
    private readonly webhookService: WebhookService
  ) {}

  async execute({ id, userId }: PublishUseCaseSchemaType): Promise<Content> {
    const contentWithRevisions = await this.contentRepository.findOneWithRevisionsById(
      this.prisma,
      id
    );

    if (!contentWithRevisions) {
      throw new RecordNotFoundException('record_not_found');
    }

    const updatedContent = await this.contentService.publish(
      this.prisma,
      userId,
      contentWithRevisions.content,
      contentWithRevisions.revisions
    );

    await this.webhookService.send(this.prisma, WebhookTriggerEvent.publish, updatedContent);

    return updatedContent.toResponse();
  }
}
