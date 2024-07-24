import { ApiKey } from '@prisma/client';
import { ApiKeyEntity } from '../../data/apiKey/apiKey.entity.js';
import { ApiKeyRepository } from '../../data/apiKey/apiKey.repository.js';
import { ApiKeyPermissionEntity } from '../../data/apiKeyPermission/apiKeyPermission.entity.js';
import { ApiKeyPermissionRepository } from '../../data/apiKeyPermission/apiKeyPermission.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CreateApiKeyUseCaseSchemaType } from './createApiKey.schema.js';

export class CreateApiKeyUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly apiKeyPermissionRepository: ApiKeyPermissionRepository
  ) {}

  async execute(params: CreateApiKeyUseCaseSchemaType): Promise<ApiKey> {
    const apiKey = ApiKeyEntity.Construct({
      name: params.name,
      projectId: params.projectId,
      createdById: params.createdById,
    });

    const permissions = params.permissions.map((permission) => {
      return ApiKeyPermissionEntity.Construct({
        apiKeyId: apiKey.id,
        projectId: params.projectId,
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
