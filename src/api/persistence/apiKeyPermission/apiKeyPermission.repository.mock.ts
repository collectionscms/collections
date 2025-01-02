import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ApiKeyPermissionEntity } from './apiKeyPermission.entity.js';
import { ApiKeyPermissionRepository } from './apiKeyPermission.repository.js';

export class InMemoryApiKeyPermissionRepository extends ApiKeyPermissionRepository {
  async createMany(
    _prisma: ProjectPrismaType,
    entities: ApiKeyPermissionEntity[]
  ): Promise<ApiKeyPermissionEntity[]> {
    return entities;
  }
}
