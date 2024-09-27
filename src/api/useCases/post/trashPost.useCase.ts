import { Content } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { TrashPostUseCaseSchemaType } from './trashPost.useCase.schema.js';

export class TrashPostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute({ id, userId }: TrashPostUseCaseSchemaType): Promise<Content[]> {
    const contentWithRevisions = await this.contentRepository.findManyWithRevisionsByPostId(
      this.prisma,
      id
    );

    const trashedContent = await this.prisma.$transaction(async (tx) => {
      const result = [];
      for (const { content, revisions } of contentWithRevisions) {
        const latestRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
          revisions,
          content.language
        );

        const contentRevision = ContentRevisionEntity.Construct({
          ...latestRevision.toResponse(),
          version: latestRevision.version + 1,
          createdById: userId,
          updatedById: userId,
        });
        contentRevision.trash();

        content.trash(contentRevision.version, userId);
        result.push(content);

        await this.contentRevisionRepository.create(tx, contentRevision);
        await this.contentRepository.updateStatus(tx, content);
      }

      return result;
    });

    const publishedContents = trashedContent.filter((content) => content.isPublished());
    for (const content of publishedContents) {
      await this.webhookService.send(
        this.prisma,
        content.projectId,
        WebhookTriggerEvent.deletePublished,
        null
      );
    }

    return trashedContent.map((content) => content.toResponse());
  }
}
