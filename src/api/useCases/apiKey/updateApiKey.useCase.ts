import { ApiKey } from '@prisma/client';
import { ApiKeyRepository } from '../../data/apiKey/apiKey.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { UpdateApiKeyUseCaseSchemaType } from './updateApiKey.schema.js';

export class UpdateApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute(params: UpdateApiKeyUseCaseSchemaType): Promise<ApiKey> {
    const apiKey = await this.apiKeyRepository.findOne(this.prisma, params.apiKeyId);

    apiKey.update(params);
    const updatedApiKey = await this.apiKeyRepository.update(this.prisma, apiKey);

    return updatedApiKey.toResponse();
  }
}
