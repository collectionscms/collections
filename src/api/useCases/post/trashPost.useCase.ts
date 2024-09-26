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
    const contents = await this.contentRepository.findManyByPostId(this.prisma, id);

    const deletedContents = await this.prisma.$transaction(async (tx) => {
      const result = [];
      for (const { content, createdBy } of contents) {
        content.delete(userId);
        await this.contentRepository.delete(tx, content);
        result.push(content);

        const contentRevision = ContentRevisionEntity.Construct({
          ...content.toResponse(),
          contentId: content.id,
          version: content.currentVersion,
        });
        await this.contentRevisionRepository.create(tx, contentRevision);
      }

      return result;
    });

    const publishedContents = deletedContents.filter((content) => content.isPublished());
    for (const content of publishedContents) {
      await this.webhookService.send(
        this.prisma,
        content.projectId,
        WebhookTriggerEvent.deletePublished,
        null
      );
    }

    return deletedContents.map((content) => content.toResponse());
  }
}
