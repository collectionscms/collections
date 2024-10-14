import { TextGenerationUsage } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { TextGenerationUsageEntity } from './textGenerationUsage.entity.js';

export class TextGenerationUsageRepository {
  async create(
    prisma: ProjectPrismaType,
    entity: TextGenerationUsageEntity
  ): Promise<TextGenerationUsageEntity> {
    entity.beforeInsertValidate();

    const record = await prisma.textGenerationUsage.create({
      data: {
        ...entity.toPersistence(),
        sourceText: entity.sourceText || {},
        generatedText: entity.generatedText || {},
      },
    });

    return TextGenerationUsageEntity.Reconstruct<TextGenerationUsage, TextGenerationUsageEntity>(
      record
    );
  }

  async createMany(
    prisma: ProjectPrismaType,
    entities: TextGenerationUsageEntity[]
  ): Promise<TextGenerationUsageEntity[]> {
    for (const entity of entities) {
      entity.beforeInsertValidate();
    }

    await prisma.textGenerationUsage.createMany({
      data: entities.map((entity) => ({
        ...entity.toPersistence(),
        sourceText: entity.sourceText || {},
        generatedText: entity.generatedText || {},
      })),
    });

    return entities;
  }
}
