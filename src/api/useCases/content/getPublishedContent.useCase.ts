import { Content } from '@prisma/client';
import { z } from 'zod';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { PublishedContent } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { ContentTagRepository } from '../../persistence/contentTag/contentTag.repository.js';
import { UserEntity } from '../../persistence/user/user.entity.js';
import { GetPublishedContentUseCaseSchemaType } from './getPublishedContent.useCase.schema.js';

export class GetPublishedContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly contentRepository: ContentRepository,
    private readonly contentTagRepository: ContentTagRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  getDraftContentByIdentifier = async (
    identifier: string,
    isUuid: boolean,
    draftKey: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity | null }> => {
    const record = isUuid
      ? await this.contentRevisionRepository.findLatestOneByContentIdOrSlug(this.prisma, identifier)
      : await this.contentRevisionRepository.findLatestOneBySlug(this.prisma, identifier);

    if (
      !record ||
      record.contentRevision.deletedAt ||
      record.contentRevision.draftKey !== draftKey
    ) {
      throw new RecordNotFoundException('record_not_found');
    }

    return {
      content: ContentEntity.Reconstruct<Content, ContentEntity>(
        record.contentRevision.toContentResponse()
      ),
      createdBy: record.createdBy,
    };
  };

  getContentByIdentifier = async (
    identifier: string,
    isUuid: boolean
  ): Promise<{ content: ContentEntity; createdBy: UserEntity | null }> => {
    const record = isUuid
      ? await this.contentRepository.findOneByIdOrSlug(this.prisma, identifier)
      : await this.contentRepository.findOneBySlug(this.prisma, identifier);

    if (!record || !record?.content.isPublished()) {
      throw new RecordNotFoundException('record_not_found');
    }

    return record;
  };

  async execute({
    identifier,
    draftKey,
  }: GetPublishedContentUseCaseSchemaType): Promise<PublishedContent> {
    const encodedIdentifier = encodeURI(identifier);
    const isUuid = z.string().uuid().safeParse(identifier).success;

    const { content, createdBy } = draftKey
      ? await this.getDraftContentByIdentifier(encodedIdentifier, isUuid, draftKey)
      : await this.getContentByIdentifier(encodedIdentifier, isUuid);

    const tags = await this.contentTagRepository.findTagsByContentId(this.prisma, content.id);

    return content.toPublishedContentResponse(createdBy, tags);
  }
}
