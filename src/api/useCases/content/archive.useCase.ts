import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { ArchiveUseCaseSchemaType } from './archive.useCase.schema.js';

export class ArchiveUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute(props: ArchiveUseCaseSchemaType): Promise<Content> {
    const { id, userId } = props;

    const contentWithRevisions = await this.contentRepository.findOneWithRevisionsById(
      this.prisma,
      id
    );

    if (!contentWithRevisions) {
      throw new RecordNotFoundException('record_not_found');
    }

    const latestRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
      contentWithRevisions.revisions,
      contentWithRevisions.content.language
    );

    const contentRevision = ContentRevisionEntity.Construct({
      ...latestRevision.toResponse(),
      version: latestRevision.version + 1,
      createdById: userId,
      updatedById: userId,
    });
    contentRevision.archive();

    const content = contentWithRevisions.content;
    content.archive(contentRevision.version, userId);

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      await this.contentRevisionRepository.create(tx, contentRevision);
      const result = await this.contentRepository.updateStatus(tx, content);

      return result;
    });

    await this.webhookService.send(
      this.prisma,
      updatedContent.projectId,
      WebhookTriggerEvent.archive,
      null
    );

    return updatedContent.toResponse();
  }
}
