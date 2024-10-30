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
}
