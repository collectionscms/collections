import { ApiKey } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ApiKeyEntity } from './apiKey.entity.js';

export class ApiKeyRepository {
  async findMany(prisma: ProjectPrismaType): Promise<ApiKeyEntity[]> {
    const records = await prisma.apiKey.findMany();
    return records.map((record) => ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(record));
  }
}
