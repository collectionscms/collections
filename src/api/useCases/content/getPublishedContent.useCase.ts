import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { PublishedContent } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentTagRepository } from '../../persistence/contentTag/contentTag.repository.js';
import { GetPublishedContentUseCaseSchemaType } from './getPublishedContent.useCase.schema.js';

export class GetPublishedContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly contentRepository: ContentRepository,
    private readonly contentTagRepository: ContentTagRepository
  ) {}

  async execute(props: GetPublishedContentUseCaseSchemaType): Promise<PublishedContent> {
    const record = await this.contentRepository.findOneBySlug(this.prisma, encodeURI(props.slug));
    if (!record) {
      throw new RecordNotFoundException('record_not_found');
    }

    const tags = await this.contentTagRepository.findTagsByContentId(
      this.prisma,
      record.content.id
    );

    return record.content.toPublishedContentResponse(record.createdBy, tags);
  }
}
