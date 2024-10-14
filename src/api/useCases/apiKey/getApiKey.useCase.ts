import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ApiKeyWithPermissions } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ApiKeyRepository } from '../../persistence/apiKey/apiKey.repository.js';
import { GetApiKeyUseCaseSchemaType } from './getApiKey.useCase.schema.js';

export class GetApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute({ apiKeyId }: GetApiKeyUseCaseSchemaType): Promise<ApiKeyWithPermissions> {
    const apiKeyWithPermission = await this.apiKeyRepository.findOneWithPermissions(
      this.prisma,
      apiKeyId
    );

    if (!apiKeyWithPermission) {
      throw new RecordNotFoundException('record_not_found');
    }

    return {
      ...apiKeyWithPermission.apiKey.toResponse(),
      permissions: apiKeyWithPermission.permissions.map(
        (permission) => permission.permissionAction
      ),
    };
  }
}
