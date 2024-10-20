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

    const { trashedContent, sendContents } = await this.prisma.$transaction(async (tx) => {
      const trashedContent = [];
      const sendContents = [];
      for (const { content, revisions } of contentWithRevisions) {
        if (content.isPublished()) {
          sendContents.push(content);
        }

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
        content.trash(userId);

        trashedContent.push(content);

        await this.contentRevisionRepository.create(tx, contentRevision);
        await this.contentRepository.trash(tx, content);
      }

      return { trashedContent, sendContents };
    });

    for (const content of sendContents) {
      await this.webhookService.send(this.prisma, WebhookTriggerEvent.trashPublished, content);
    }

    return trashedContent.map((content) => content.toResponse());
  }
}
