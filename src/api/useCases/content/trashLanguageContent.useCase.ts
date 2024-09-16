import { Content } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistence/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { TrashLanguageContentUseCaseSchemaType } from './trashLanguageContent.useCase.schema.js';

export class TrashLanguageContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository,
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

        const contentHistory = ContentHistoryEntity.Construct({
          ...content.toResponse(),
        });
        await this.contentHistoryRepository.create(tx, contentHistory);
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
        {
          old: content.toPublishedContentResponse(createdBy),
          new: null,
        }
      );
    }

    return deletedContents.map((content) => content.toResponse());
  }
}
