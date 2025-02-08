import { Content } from '@prisma/client';
import { NodeObject } from 'jsonld';
import { z } from 'zod';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { PublishedContent } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { ContentTagRepository } from '../../persistence/contentTag/contentTag.repository.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { JsonLdService } from '../../services/jsonLd.service.js';
import { GetPublishedContentUseCaseSchemaType } from './getPublishedContent.useCase.schema.js';

export class GetPublishedContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly contentRepository: ContentRepository,
    private readonly contentTagRepository: ContentTagRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly userRepository: UserRepository,
    private readonly jsonLdService: JsonLdService
  ) {}

  // Get draft content by identifier
  getDraftContentByIdentifier = async (
    identifier: string,
    isUuid: boolean,
    draftKey: string
  ): Promise<ContentEntity> => {
    const contentRevision = isUuid
      ? await this.contentRevisionRepository.findLatestOneByContentIdOrSlug(this.prisma, identifier)
      : await this.contentRevisionRepository.findLatestOneBySlug(this.prisma, identifier);

    if (!contentRevision || contentRevision.draftKey !== draftKey) {
      throw new RecordNotFoundException('record_not_found');
    }

    return ContentEntity.Reconstruct<Content, ContentEntity>(contentRevision.toContentResponse());
  };

  // Get published content by identifier
  getContentByIdentifier = async (identifier: string, isUuid: boolean): Promise<ContentEntity> => {
    const content = isUuid
      ? await this.contentRepository.findOneByIdOrSlug(this.prisma, identifier)
      : await this.contentRepository.findOneBySlug(this.prisma, identifier);

    if (!content || !content.isPublished()) {
      throw new RecordNotFoundException('record_not_found');
    }

    return ContentEntity.Reconstruct<Content, ContentEntity>(content.toResponse());
  };

  async execute({ identifier, draftKey }: GetPublishedContentUseCaseSchemaType): Promise<{
    content: PublishedContent;
    jsonLd: NodeObject;
  }> {
    const encodedIdentifier = encodeURI(identifier);
    const isUuid = z.string().uuid().safeParse(identifier).success;

    const content = draftKey
      ? await this.getDraftContentByIdentifier(encodedIdentifier, isUuid, draftKey)
      : await this.getContentByIdentifier(encodedIdentifier, isUuid);

    const userWithProfiles = await this.userRepository.findOneWithProfilesById(
      this.prisma,
      content.createdById
    );

    if (!userWithProfiles) {
      throw new RecordNotFoundException('record_not_found');
    }

    const tags = await this.contentTagRepository.findTagsByContentId(this.prisma, content.id);

    const publishedContent = content.toPublishedContentResponse(userWithProfiles.user, tags);
    const jsonLd = await this.jsonLdService.toBlogJsonLd({
      content,
      tags,
      ...userWithProfiles,
    });

    return {
      content: publishedContent,
      jsonLd,
    };
  }
}
