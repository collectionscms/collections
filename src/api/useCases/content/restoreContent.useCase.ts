import { Content } from '@prisma/client';
import { ConflictException } from '../../../exceptions/conflict.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { RestoreContentUseCaseSchemaType } from './restoreContent.useCase.schema.js';

export class RestoreContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute({ id, userId }: RestoreContentUseCaseSchemaType): Promise<Content> {
    const { content, createdBy } = await this.contentRepository.findOneById(this.prisma, id);
    const post = await this.postRepository.findOneWithContentsById(this.prisma, content.postId);

    const sameLanguageContent = post.contents.find((c) => c.content.language === content.language);
    if (sameLanguageContent) {
      throw new ConflictException('already_has_same_language_content');
    }

    content.restore(userId);

    const restoredContent = await this.contentRepository.restore(this.prisma, content);

    if (content.isPublished()) {
      await this.webhookService.send(
        this.prisma,
        content.projectId,
        WebhookTriggerEvent.deletePublished,
        restoredContent.toPublishedContentResponse(createdBy)
      );
    }

    return restoredContent.toResponse();
  }
}
