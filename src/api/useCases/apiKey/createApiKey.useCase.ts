import { ApiKey } from '@prisma/client';
import { ApiKeyEntity } from '../../persistence/apiKey/apiKey.entity.js';
import { ApiKeyRepository } from '../../persistence/apiKey/apiKey.repository.js';
import { ApiKeyPermissionEntity } from '../../persistence/apiKeyPermission/apiKeyPermission.entity.js';
import { ApiKeyPermissionRepository } from '../../persistence/apiKeyPermission/apiKeyPermission.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CreateApiKeyUseCaseSchemaType } from './createApiKey.schema.js';

export class CreateApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly apiKeyPermissionRepository: ApiKeyPermissionRepository
  ) {}

  async execute(props: CreateApiKeyUseCaseSchemaType): Promise<ApiKey> {
    const apiKey = ApiKeyEntity.Construct({
      name: props.name,
      projectId: props.projectId,
      createdById: props.createdById,
    });

    const permissions = props.permissions.map((permission) => {
      return ApiKeyPermissionEntity.Construct({
        apiKeyId: apiKey.id,
        projectId: props.projectId,
        permissionAction: permission,
      });
    });

    const createdApiKey = await this.prisma.$transaction(async (tx) => {
      const result = await this.apiKeyRepository.create(tx, apiKey);
      await this.apiKeyPermissionRepository.createMany(tx, permissions);

      return result;
    });

    return createdApiKey.toResponse();
  }
}
