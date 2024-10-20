import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { RestoreContentUseCaseSchemaType } from './restoreContent.useCase.schema.js';

export class RestoreContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute({ id, userId }: RestoreContentUseCaseSchemaType): Promise<Content> {
    const content = await this.contentRepository.findOneById(this.prisma, id);
    const revision = await this.contentRevisionRepository.findLatestOneByContentId(this.prisma, id);

    if (!content || !revision) {
      throw new RecordNotFoundException('record_not_found');
    }

    content.restore(revision.status, userId);

    const restoredContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.restore(this.prisma, content);

      // delete all revisions after restored version
      const previousVersion = revision.version - 1;
      await this.contentRevisionRepository.deleteAfterVersion(tx, content.id, previousVersion);

      return result;
    });

    if (restoredContent.isPublished()) {
      await this.webhookService.send(
        this.prisma,
        WebhookTriggerEvent.deletePublished,
        restoredContent
      );
    }

    return restoredContent.toResponse();
  }
}
