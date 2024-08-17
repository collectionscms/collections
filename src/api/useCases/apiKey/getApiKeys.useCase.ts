import { ApiKey } from '@prisma/client';
import { ApiKeyRepository } from '../../persistences/apiKey/apiKey.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetApiKeysUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute(): Promise<ApiKey[]> {
    const records = await this.apiKeyRepository.findMany(this.prisma);

    return records.map((record) => record.toResponse());
  }
}
