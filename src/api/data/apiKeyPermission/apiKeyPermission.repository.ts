import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ApiKeyPermissionEntity } from './apiKeyPermission.entity.js';

export class ApiKeyPermissionRepository {
  async createMany(
    prisma: ProjectPrismaType,
    entities: ApiKeyPermissionEntity[]
  ): Promise<ApiKeyPermissionEntity[]> {
    for (const entity of entities) {
      entity.beforeInsertValidate();
    }

    await prisma.apiKeyPermission.createMany({
      data: entities.map((entity) => entity.toPersistence()),
    });
    return entities;
  }

  async deleteManyByApiKeyId(prisma: ProjectPrismaType, apiKeyId: string): Promise<void> {
    await prisma.apiKeyPermission.deleteMany({
      where: {
        apiKeyId,
      },
    });
  }
}
