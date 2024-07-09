import { ContentHistory } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentHistoryEntity } from './contentHistory.entity.js';

export class ContentHistoryRepository {
  async create(
    prisma: ProjectPrismaType,
    entity: ContentHistoryEntity
  ): Promise<ContentHistoryEntity> {
    entity.beforeInsertValidate();

    const record = await prisma.contentHistory.create({
      data: entity.toPersistence(),
    });

    return ContentHistoryEntity.Reconstruct<ContentHistory, ContentHistoryEntity>(record);
  }

  async createMany(
    prisma: ProjectPrismaType,
    entities: ContentHistoryEntity[]
  ): Promise<ContentHistoryEntity[]> {
    await prisma.contentHistory.createMany({
      data: entities.map((entity) => entity.toPersistence()),
    });

    return entities;
  }
}
