import { Content } from '@prisma/client';
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

  getDraftContentBySlug = async (
    slug: string,
    draftKey: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity }> => {
    const record = await this.contentRevisionRepository.findLatestOneBySlug(this.prisma, slug);
    if (!record || record.contentRevision.draftKey !== draftKey) {
      throw new RecordNotFoundException('record_not_found');
    }

    return {
      content: ContentEntity.Reconstruct<Content, ContentEntity>(
        record.contentRevision.toContentResponse()
      ),
      createdBy: record.createdBy,
    };
  };

  getContentBySlug = async (
    slug: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity }> => {
    const record = await this.contentRepository.findOneBySlug(this.prisma, slug);
    if (!record || !record.content.isPublished()) {
      throw new RecordNotFoundException('record_not_found');
    }

    return record;
  };

  async execute({
    slug,
    draftKey,
  }: GetPublishedContentUseCaseSchemaType): Promise<PublishedContent> {
    const encodedSlug = encodeURI(slug);
    const { content, createdBy } = draftKey
      ? await this.getDraftContentBySlug(encodedSlug, draftKey)
      : await this.getContentBySlug(encodedSlug);

    const tags = await this.contentTagRepository.findTagsByContentId(this.prisma, content.id);

    return content.toPublishedContentResponse(createdBy, tags);
  }
}
