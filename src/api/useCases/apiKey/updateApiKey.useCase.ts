import { ApiKey } from '@prisma/client';
import { ApiKeyRepository } from '../../persistence/apiKey/apiKey.repository.js';
import { ApiKeyPermissionEntity } from '../../persistence/apiKeyPermission/apiKeyPermission.entity.js';
import { ApiKeyPermissionRepository } from '../../persistence/apiKeyPermission/apiKeyPermission.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdateApiKeyUseCaseSchemaType } from './updateApiKey.schema.js';

export class UpdateApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly apiKeyPermissionRepository: ApiKeyPermissionRepository
  ) {}

  async execute(props: UpdateApiKeyUseCaseSchemaType): Promise<ApiKey> {
    const apiKey = await this.apiKeyRepository.findOne(this.prisma, props.apiKeyId);

    apiKey.update(props);

    const permissions = props.permissions.map((permission) => {
      return ApiKeyPermissionEntity.Construct({
        apiKeyId: apiKey.id,
        projectId: props.projectId,
        permissionAction: permission,
      });
    });

    const updatedApiKey = await this.prisma.$transaction(async (tx) => {
      const result = await this.apiKeyRepository.update(tx, apiKey);
      await this.apiKeyPermissionRepository.deleteManyByApiKeyId(tx, props.apiKeyId);
      await this.apiKeyPermissionRepository.createMany(tx, permissions);

      return result;
    });

    return updatedApiKey.toResponse();
  }
}
