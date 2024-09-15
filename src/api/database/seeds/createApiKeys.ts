import { ApiKey } from '@prisma/client';
import { v4 } from 'uuid';
import { BypassPrismaType } from '../prisma/client.js';

export const createApiKeys = async (
  prisma: BypassPrismaType,
  apiKeys: {
    apiKey: Omit<ApiKey, 'createdAt' | 'updatedAt'>;
    permissions: string[];
  }[]
): Promise<void> => {
  for (const { apiKey, permissions } of apiKeys) {
    await prisma.apiKey.create({
      data: {
        id: apiKey.id,
        key: apiKey.key,
        name: apiKey.name,
        projectId: apiKey.projectId,
        createdById: apiKey.createdById,
        updatedById: apiKey.updatedById,
        apiKeyPermissions: {
          create: permissions.map((permission) => ({
            id: v4(),
            projectId: apiKey.projectId,
            permissionAction: permission,
          })),
        },
      },
    });
  }
};
