import { Tag } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { TagEntity } from '../tag/tag.entity.js';
import { ContentTagEntity } from './contentTag.entity.js';

export class ContentTagRepository {
  async findTagsByContentId(prisma: ProjectPrismaType, contentId: string): Promise<TagEntity[]> {
    const records = await prisma.contentTag.findMany({
      where: {
        contentId,
      },
      include: {
        tag: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return records.map((record) => TagEntity.Reconstruct<Tag, TagEntity>(record.tag));
  }

  async createMany(prisma: ProjectPrismaType, entities: ContentTagEntity[]): Promise<void> {
    for (const entity of entities) {
      entity.beforeInsertValidate();
    }

    await prisma.contentTag.createMany({
      data: entities.map((entity) => entity.toPersistence()),
    });
  }

  async deleteManyByContentId(prisma: ProjectPrismaType, contentId: string): Promise<void> {
    await prisma.contentTag.deleteMany({
      where: {
        contentId,
      },
    });
  }
}
