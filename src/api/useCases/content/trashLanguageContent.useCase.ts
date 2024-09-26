import { Content } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { TrashLanguageContentUseCaseSchemaType } from './trashLanguageContent.useCase.schema.js';

export class TrashLanguageContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute(props: TrashLanguageContentUseCaseSchemaType): Promise<Content[]> {
    const { postId, userId, language } = props;
    const contents = await this.contentRepository.findManyByPostIdAndLanguage(
      this.prisma,
      postId,
      language
    );

    const deletedContents = await this.prisma.$transaction(async (tx) => {
      const result = [];
      for (const { content } of contents) {
        content.delete(userId);
        const deletedContent = await this.contentRepository.delete(tx, content);
        result.push(deletedContent);

        const contentRevision = ContentRevisionEntity.Construct({
          ...content.toResponse(),
          contentId: content.id,
          version: content.currentVersion,
        });
        await this.contentRevisionRepository.create(tx, contentRevision);
      }

      return result;
    });

    const publishedContents = contents.filter(({ content }) => content.isPublished());
    if (publishedContents.length > 0) {
      const { content, createdBy } = publishedContents[0];

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
