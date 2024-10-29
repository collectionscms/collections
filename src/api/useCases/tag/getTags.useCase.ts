import { Tag } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { TagRepository } from '../../persistence/tag/tag.repository.js';
import { GetTagsUseCaseSchemaType } from './getTags.useCase.schema.js';

export class GetTagsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly tagRepository: TagRepository
  ) {}

  async execute(_props: GetTagsUseCaseSchemaType): Promise<Tag[]> {
    const tags = await this.tagRepository.findMany(this.prisma);
    const sortedTags = tags.sort((a, b) => a.name.localeCompare(b.name));
    return sortedTags.map((tag) => tag.toResponse());
  }
}
