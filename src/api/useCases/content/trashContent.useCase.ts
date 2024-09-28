import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { TrashContentUseCaseSchemaType } from './trashContent.useCase.schema.js';

export class TrashContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly userRepository: UserRepository,
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

    const { content, revisions } = contentWithRevisions;

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

    const trashedContent = await this.prisma.$transaction(async (tx) => {
      await this.contentRevisionRepository.create(tx, contentRevision);
      const result = await this.contentRepository.trash(tx, content);

      return result;
    });

    if (content.isPublished()) {
      const createdBy = await this.userRepository.findOneById(this.prisma, content.createdById);

      await this.webhookService.send(
        this.prisma,
        content.projectId,
        WebhookTriggerEvent.deletePublished,
        trashedContent.toPublishedContentResponse(createdBy)
      );
    }

    return trashedContent.toResponse();
  }
}
