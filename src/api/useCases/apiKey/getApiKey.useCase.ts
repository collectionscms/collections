import { ApiKey } from '@prisma/client';
import { ApiKeyRepository } from '../../data/apiKey/apiKey.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetApiKeyUseCaseSchemaType } from './getApiKey.schema.js';

export class GetApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute({ apiKeyId }: GetApiKeyUseCaseSchemaType): Promise<ApiKey> {
    const apiKey = await this.apiKeyRepository.findOne(this.prisma, apiKeyId);

    return apiKey.toResponse();
  }
}
