import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { ContentService } from '../../services/content.service.js';
import { WebhookService } from '../../services/webhook.service.js';
import { PublishUseCaseSchemaType } from './publish.useCase.schema.js';

export class PublishUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly userRepository: UserRepository,
    private readonly contentService: ContentService,
    private readonly webhookService: WebhookService
  ) {}

  async execute({ id, userId }: PublishUseCaseSchemaType): Promise<Content> {
    const contentWithRevisions = await this.contentRepository.findOneWithRevisionsById(
      this.prisma,
      id
    );

    if (!contentWithRevisions) {
      throw new RecordNotFoundException('record_not_found');
    }

    const { content, revisions } = contentWithRevisions;

    const latestRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
      revisions,
      content.language
    );

    latestRevision.publish(userId);

    content.publish({
      slug: latestRevision.slug,
      title: latestRevision.title,
      body: latestRevision.body,
      bodyJson: latestRevision.bodyJson,
      bodyHtml: latestRevision.bodyHtml,
      summary: latestRevision.summary,
      metaTitle: latestRevision.metaTitle,
      metaDescription: latestRevision.metaDescription,
      coverUrl: latestRevision.coverUrl,
      currentVersion: latestRevision.version,
      updatedById: userId,
    });

    const isUniqueSlug = await this.contentService.isUniqueSlug(
      this.prisma,
      content.id,
      latestRevision.slug
    );
    if (!isUniqueSlug) {
      throw new RecordNotUniqueException('already_registered_post_slug');
    }

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.update(tx, content);
      await this.contentRevisionRepository.update(tx, latestRevision);

      return result;
    });

    const createdBy = await this.userRepository.findOneById(this.prisma, content.createdById);

    await this.webhookService.send(
      this.prisma,
      updatedContent.projectId,
      WebhookTriggerEvent.publish,
      updatedContent.toPublishedContentResponse(createdBy)
    );

    return updatedContent.toResponse();
  }
}
