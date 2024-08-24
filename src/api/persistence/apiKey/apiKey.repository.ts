import { ApiKey, ApiKeyPermission, Project } from '@prisma/client';
import { BypassPrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { ApiKeyPermissionEntity } from '../apiKeyPermission/apiKeyPermission.entity.js';
import { ProjectEntity } from '../project/project.entity.js';
import { ApiKeyEntity } from './apiKey.entity.js';

export class ApiKeyRepository {
  async findOne(prisma: ProjectPrismaType, id: string): Promise<ApiKeyEntity> {
    const record = await prisma.apiKey.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(record);
  }

  async findOneWithProjectByKey(
    prisma: BypassPrismaType,
    key: string
  ): Promise<{ apiKey: ApiKeyEntity; project: ProjectEntity } | null> {
    const record = await prisma.apiKey.findFirst({
      where: {
        key,
      },
      include: {
        project: true,
      },
    });

    return record
      ? {
          apiKey: ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(record),
          project: ProjectEntity.Reconstruct<Project, ProjectEntity>(record.project),
        }
      : null;
  }

  async findOneWithPermissions(
    prisma: ProjectPrismaType,
    id: string
  ): Promise<{
    apiKey: ApiKeyEntity;
    permissions: ApiKeyPermissionEntity[];
  }> {
    const record = await prisma.apiKey.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        apiKeyPermissions: true,
      },
    });

    return {
      apiKey: ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(record),
      permissions: record.apiKeyPermissions.map((permission) =>
        ApiKeyPermissionEntity.Reconstruct<ApiKeyPermission, ApiKeyPermissionEntity>(permission)
      ),
    };
  }

  async findMany(prisma: ProjectPrismaType): Promise<ApiKeyEntity[]> {
    const records = await prisma.apiKey.findMany();
    return records.map((record) => ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(record));
  }

  async create(prisma: ProjectPrismaType, entity: ApiKeyEntity): Promise<ApiKeyEntity> {
    entity.beforeInsertValidate();

    const result = await prisma.apiKey.create({
      data: entity.toPersistence(),
    });
    return ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(result);
  }

  async update(prisma: ProjectPrismaType, entity: ApiKeyEntity): Promise<ApiKeyEntity> {
    entity.beforeUpdateValidate();

    const record = entity.toPersistence();
    const result = await prisma.apiKey.update({
      where: {
        id: entity.id,
      },
      data: {
        name: record.name,
        key: record.key,
      },
    });
    return ApiKeyEntity.Reconstruct<ApiKey, ApiKeyEntity>(result);
  }

  async delete(prisma: ProjectPrismaType, entity: ApiKeyEntity): Promise<void> {
    await prisma.apiKey.delete({
      where: {
        id: entity.id,
      },
    });
  }
}
