import { Content } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentStatus } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { PublishUseCaseSchemaType } from './publish.useCase.schema.js';

export class PublishUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute(props: PublishUseCaseSchemaType): Promise<Content> {
    const { id, userId } = props;

    const { content, createdBy } = await this.contentRepository.findOneById(this.prisma, id);
    content.changeStatus({
      status: ContentStatus.published,
      updatedById: userId,
    });

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.updateStatus(tx, content);

      const contentRevision = ContentRevisionEntity.Construct({
        ...result.toResponse(),
        contentId: content.id,
      });
      await this.contentRevisionRepository.create(tx, contentRevision);

      // hard delete previous contents
      const previousContent = await this.contentRepository.findOneByPostIdAndLanguage(
        tx,
        result.id,
        result.postId,
        result.language
      );
      if (previousContent) {
        await this.contentRepository.hardDelete(tx, previousContent);
      }

      return result;
    });

    await this.webhookService.send(
      this.prisma,
      updatedContent.projectId,
      WebhookTriggerEvent.publish,
      updatedContent.toPublishedContentResponse(createdBy)
    );

    return updatedContent.toResponse();
  }
}
