import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { ContentService } from '../../services/content.service.js';
import { WebhookService } from '../../services/webhook.service.js';
import { PublishUseCaseSchemaType } from './publish.useCase.schema.js';

export class PublishUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly userRepository: UserRepository,
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

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      return await this.contentService.publish(
        tx,
        userId,
        contentWithRevisions.content,
        contentWithRevisions.revisions
      );
    });

    const createdBy = await this.userRepository.findOneById(
      this.prisma,
      updatedContent.createdById
    );

    await this.webhookService.send(
      this.prisma,
      updatedContent.projectId,
      WebhookTriggerEvent.publish,
      updatedContent.toPublishedContentResponse(createdBy)
    );

    return updatedContent.toResponse();
  }
}
