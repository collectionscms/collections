import { Content } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentStatus } from '../../persistence/content/content.entity.js';
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

    const { content, createdBy } = await this.contentRepository.findOneById(this.prisma, id);

    content.delete(userId);

    const deletedContent = await this.prisma.$transaction(async (tx) => {
      const deletedContent = await this.contentRepository.delete(tx, content);

      const contentRevision = ContentRevisionEntity.Construct({
        ...content.toResponse(),
      });
      await this.contentRevisionRepository.create(tx, contentRevision);

      return deletedContent;
    });

    if (content.isPublished()) {
      await this.webhookService.send(
        this.prisma,
        content.projectId,
        WebhookTriggerEvent.deletePublished,
        deletedContent.toPublishedContentResponse(createdBy)
      );
    }

    return deletedContent.toResponse();
  }
}
