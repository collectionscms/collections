import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { PublishedContent } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { GetPublishedContentUseCaseSchemaType } from './getPublishedContent.schema.js';

export class GetPublishedContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(props: GetPublishedContentUseCaseSchemaType): Promise<PublishedContent> {
    const record = await this.contentRepository.findOneBySlug(this.prisma, props.slug);
    if (!record) {
      throw new RecordNotFoundException('record_not_found');
    }

    return record.content.toPublishedContentResponse(record.createdBy);
  }
}
