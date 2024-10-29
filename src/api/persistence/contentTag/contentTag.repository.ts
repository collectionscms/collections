import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentTagEntity } from './contentTag.entity.js';

export class ContentTagRepository {
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
