import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentStatus } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
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

  async execute({ id, userId }: PublishUseCaseSchemaType): Promise<Content> {
    const contentWithRevisions = await this.contentRepository.findOneWithRevisionsById(
      this.prisma,
      id
    );
    const latestRevision = contentWithRevisions?.revisions[0];

    if (!contentWithRevisions || !latestRevision) {
      throw new RecordNotFoundException('record_not_found');
    }

    latestRevision.changeStatus({
      status: ContentStatus.published,
      updatedById: userId,
    });

    const content = contentWithRevisions.content;
    content.publish({
      slug: latestRevision.slug,
      title: latestRevision.title,
      body: latestRevision.body,
      bodyJson: latestRevision.bodyJson,
      bodyHtml: latestRevision.bodyHtml,
      excerpt: latestRevision.excerpt,
      metaTitle: latestRevision.metaTitle,
      metaDescription: latestRevision.metaDescription,
      coverUrl: latestRevision.coverUrl,
      currentVersion: latestRevision.version,
      updatedById: userId,
    });

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.update(tx, content);
      await this.contentRevisionRepository.update(tx, latestRevision);

      return result;
    });

    await this.webhookService.send(
      this.prisma,
      updatedContent.projectId,
      WebhookTriggerEvent.publish,
      updatedContent.toPublishedContentResponse(contentWithRevisions.createdBy)
    );

    return updatedContent.toResponse();
  }
}
