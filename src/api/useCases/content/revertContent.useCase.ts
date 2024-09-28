import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { WebhookTriggerEvent } from '../../persistence/webhookLog/webhookLog.entity.js';
import { WebhookService } from '../../services/webhook.service.js';
import { RevertContentUseCaseSchemaType } from './revertContent.useCase.schema.js';

export class RevertContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly webhookService: WebhookService
  ) {}

  async execute({
    id,
    userId,
    contentRevisionId,
  }: RevertContentUseCaseSchemaType): Promise<Content> {
    const content = await this.contentRepository.findOneById(this.prisma, id);
    const revision = await this.contentRevisionRepository.findOneById(
      this.prisma,
      contentRevisionId
    );

    if (!content || !revision) {
      throw new RecordNotFoundException('record_not_found');
    }

    content.revert(revision.status, revision.version, userId);

    const revertedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.revert(this.prisma, content);

      // delete all revisions after reverted version
      await this.contentRevisionRepository.deleteAfterVersion(tx, content.id, revision.version);
      return result;
    });

    if (revertedContent.isPublished()) {
      const createdBy = await this.userRepository.findOneById(this.prisma, userId);

      await this.webhookService.send(
        this.prisma,
        content.projectId,
        WebhookTriggerEvent.deletePublished,
        revertedContent.toPublishedContentResponse(createdBy)
      );
    }

    return revertedContent.toResponse();
  }
}
