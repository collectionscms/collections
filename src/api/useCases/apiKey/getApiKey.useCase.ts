import { ApiKeyWithPermissions } from '../../../types/index.js';
import { ApiKeyRepository } from '../../persistences/apiKey/apiKey.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetApiKeyUseCaseSchemaType } from './getApiKey.schema.js';

export class GetApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute({ apiKeyId }: GetApiKeyUseCaseSchemaType): Promise<ApiKeyWithPermissions> {
    const { apiKey, permissions } = await this.apiKeyRepository.findOneWithPermissions(
      this.prisma,
      apiKeyId
    );

    return {
      ...apiKey.toResponse(),
      permissions: permissions.map((permission) => permission.permissionAction),
    };
  }
}
