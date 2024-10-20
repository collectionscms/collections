import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { RevertContentUseCaseSchemaType } from './revertContent.useCase.schema.js';

export class RevertContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute({ id, contentRevisionId }: RevertContentUseCaseSchemaType): Promise<Content> {
    const content = await this.contentRepository.findOneById(this.prisma, id);
    const revision = await this.contentRevisionRepository.findOneById(
      this.prisma,
      contentRevisionId
    );

    if (!content || !revision) {
      throw new RecordNotFoundException('record_not_found');
    }

    content.revert({
      title: revision.title,
      subtitle: revision.subtitle,
      body: revision.body,
      bodyJson: revision.bodyJson,
      bodyHtml: revision.bodyHtml,
      coverUrl: revision.coverUrl,
      slug: revision.slug,
      metaTitle: revision.metaTitle,
      metaDescription: revision.metaDescription,
      status: revision.status,
      version: revision.version,
      publishedAt: revision.publishedAt,
      updatedById: revision.updatedById,
    });

    const revertedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.update(this.prisma, content);

      // delete all revisions after reverted version
      await this.contentRevisionRepository.deleteAfterVersion(tx, content.id, revision.version);
      return result;
    });

    await this.webhookService.send(this.prisma, WebhookTriggerEvent.revert, revertedContent);

    return revertedContent.toResponse();
  }
}
