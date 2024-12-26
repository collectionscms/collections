import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { PublishedListContent } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentTagRepository } from '../../persistence/contentTag/contentTag.repository.js';
import { TagRepository } from '../../persistence/tag/tag.repository.js';
import { GetTagPublishedListContentsUseCaseSchemaType } from './getTagPublishedListContents.useCase.schema.js';

export class GetTagPublishedListContentsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly tagRepository: TagRepository,
    private readonly contentTagRepository: ContentTagRepository
  ) {}

  async execute({
    language,
    name,
  }: GetTagPublishedListContentsUseCaseSchemaType): Promise<PublishedListContent[]> {
    const tag = await this.tagRepository.findOneByName(this.prisma, name);
    if (!tag) {
      throw new RecordNotFoundException('record_not_found');
    }

    const records = await this.contentTagRepository.findPublishedContentsByTagId(
      this.prisma,
      tag.id
    );
    const filteredRecords = language
      ? records.filter((record) => record.content.language === language)
      : records;

    return filteredRecords
      .map((record) => record.content.toPublishedListContentResponse(record.createdBy))
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
}
