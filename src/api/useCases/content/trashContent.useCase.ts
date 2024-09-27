import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { TrashContentUseCaseSchemaType } from './trashContent.useCase.schema.js';

export class TrashContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute(props: TrashContentUseCaseSchemaType): Promise<Content> {
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
    contentRevision.trash();

    const content = contentWithRevisions.content;
    content.trash(contentRevision.version, userId);

    const trashedContent = await this.prisma.$transaction(async (tx) => {
      await this.contentRevisionRepository.create(tx, contentRevision);
      const result = await this.contentRepository.updateStatus(tx, content);

      return result;
    });

    if (content.isPublished()) {
      await this.webhookService.send(
        this.prisma,
        content.projectId,
        WebhookTriggerEvent.deletePublished,
        trashedContent.toPublishedContentResponse(contentWithRevisions.createdBy)
      );
    }

    return trashedContent.toResponse();
  }
}
