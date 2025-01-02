import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ApiKeyEntity } from './apiKey.entity.js';
import { ApiKeyRepository } from './apiKey.repository.js';

export class InMemoryApiKeyRepository extends ApiKeyRepository {
  async create(_prisma: ProjectPrismaType, entity: ApiKeyEntity): Promise<ApiKeyEntity> {
    return entity;
  }
}
