import { ApiKeyRepository } from '../../persistence/apiKey/apiKey.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { DeleteApiKeyUseCaseSchemaType } from './deleteApiKey.useCase.schema.js';

export class DeleteApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute(props: DeleteApiKeyUseCaseSchemaType): Promise<void> {
    const apiKey = await this.apiKeyRepository.findOne(this.prisma, props.apiKeyId);
    await this.apiKeyRepository.delete(this.prisma, apiKey);
  }
}
