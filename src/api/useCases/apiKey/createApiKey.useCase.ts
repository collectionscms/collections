import { ApiKey } from '@prisma/client';
import { ApiKeyEntity } from '../../data/apiKey/apiKey.entity.js';
import { ApiKeyRepository } from '../../data/apiKey/apiKey.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { CreateApiKeyUseCaseSchemaType } from './createApiKey.schema.js';

export class CreateApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute(params: CreateApiKeyUseCaseSchemaType): Promise<ApiKey> {
    const apiKey = ApiKeyEntity.Construct(params);
    const createdApiKey = await this.apiKeyRepository.create(this.prisma, apiKey);

    return createdApiKey.toResponse();
  }
}
