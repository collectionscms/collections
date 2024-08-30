import { ProjectPrismaType } from '../../database/prisma/client.js';
import { TranslationUsageEntity } from './translationUsage.entity.js';

export class TranslationUsageRepository {
  async createMany(
    prisma: ProjectPrismaType,
    entities: TranslationUsageEntity[]
  ): Promise<TranslationUsageEntity[]> {
    await prisma.translationUsage.createMany({
      data: entities.map((entity) => entity.toPersistence()),
    });

    return entities;
  }
}
