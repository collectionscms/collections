import { ApiKeyRepository } from '../../data/apiKey/apiKey.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { DeleteApiKeyUseCaseSchemaType } from './deleteApiKey.schema.js';

export class DeleteApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute(params: DeleteApiKeyUseCaseSchemaType): Promise<void> {
    const apiKey = await this.apiKeyRepository.findOne(this.prisma, params.apiKeyId);
    await this.apiKeyRepository.delete(this.prisma, apiKey);
  }
}
