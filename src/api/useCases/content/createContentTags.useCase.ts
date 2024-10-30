import { Tag } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentTagEntity } from '../../persistence/contentTag/contentTag.entity.js';
import { ContentTagRepository } from '../../persistence/contentTag/contentTag.repository.js';
import { TagEntity } from '../../persistence/tag/tag.entity.js';
import { TagRepository } from '../../persistence/tag/tag.repository.js';
import { CreateContentTagsUseCaseSchemaType } from './createContentTags.useCase.schema.js';

export class CreateContentTagsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentTagRepository: ContentTagRepository,
    private readonly tagRepository: TagRepository
  ) {}

  async execute({ id, projectId, names }: CreateContentTagsUseCaseSchemaType): Promise<Tag[]> {
    const tags = await this.tagRepository.findMany(this.prisma);

    const existingTags: TagEntity[] = [];
    const newTags: TagEntity[] = [];
    for (const name of names) {
      const tag = tags.find((t) => t.name === name);
      if (tag) {
        existingTags.push(tag);
      } else {
        newTags.push(TagEntity.Construct({ projectId, name }));
      }
    }

    const createdTags = await this.prisma.$transaction(async (tx) => {
      const allTags = [...existingTags, ...newTags];

      // create tags
      await this.tagRepository.createMany(tx, newTags);

      // create content tags
      await this.contentTagRepository.deleteManyByContentId(tx, id);
      const contentTags = allTags.map((tag, index) =>
        ContentTagEntity.Construct({
          projectId,
          contentId: id,
          tagId: tag.id,
          displayOrder: index,
        })
      );
      await this.contentTagRepository.createMany(tx, contentTags);

      return allTags;
    });

    return createdTags.map((tag) => tag.toResponse());
  }
}
