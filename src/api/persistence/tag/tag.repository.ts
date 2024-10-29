import { Tag } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { TagEntity } from './tag.entity.js';

export class TagRepository {
  async findMany(prisma: ProjectPrismaType): Promise<TagEntity[]> {
    const records = await prisma.tag.findMany();
    return records.map((record) => TagEntity.Reconstruct<Tag, TagEntity>(record));
  }

  async createMany(prisma: ProjectPrismaType, entities: TagEntity[]): Promise<void> {
    for (const entity of entities) {
      entity.beforeInsertValidate();
    }

    await prisma.tag.createMany({
      data: entities.map((entity) => entity.toPersistence()),
    });
  }
}
