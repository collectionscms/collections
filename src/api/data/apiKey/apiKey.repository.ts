import { ApiKey } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ApiKeyEntity } from './apiKey.entity.js';

export class ApiKeyRepository {
  async findOne(prisma: ProjectPrismaType, id: string): Promise<ApiKeyEntity> {
    const record = await prisma.apiKey.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(record);
  }

  async findMany(prisma: ProjectPrismaType): Promise<ApiKeyEntity[]> {
    const records = await prisma.apiKey.findMany();
    return records.map((record) => ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(record));
  }

  async update(prisma: ProjectPrismaType, entity: ApiKeyEntity): Promise<ApiKeyEntity> {
    const record = entity.toPersistence();
    const result = await prisma.apiKey.update({
      where: {
        id: entity.id,
      },
      data: {
        name: record.name,
        key: record.key,
      },
    });
    return ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(result);
  }

  async delete(prisma: ProjectPrismaType, entity: ApiKeyEntity): Promise<void> {
    await prisma.apiKey.delete({
      where: {
        id: entity.id,
      },
    });
  }
}
