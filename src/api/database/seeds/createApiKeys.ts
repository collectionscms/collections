import { v4 } from 'uuid';
import { apiKeyActions } from '../../persistence/permission/permission.entity.js';
import { BypassPrismaType } from '../prisma/client.js';
import { enProject, jpProject } from './createProjects.js';
import { adminUser } from './createUsers.js';

export const enEditorRole = v4();
export const jaEditorRole = v4();

export const createApiKeys = async (prisma: BypassPrismaType): Promise<void> => {
  const apiKeys = [
    {
      id: enEditorRole,
      name: 'default',
      isAdmin: false,
      projectId: enProject,
      permissions: apiKeyActions.post,
    },
    {
      id: jaEditorRole,
      name: 'default',
      isAdmin: false,
      projectId: jpProject,
      permissions: apiKeyActions.post,
    },
  ];

  for (const apiKey of apiKeys) {
    await prisma.apiKey.create({
      data: {
        key: v4(),
        id: apiKey.id,
        name: apiKey.name,
        projectId: apiKey.projectId,
        createdById: adminUser,
        updatedById: adminUser,
        apiKeyPermissions: {
          create: apiKey.permissions.map((permission) => ({
            id: v4(),
            projectId: apiKey.projectId,
            permissionAction: permission,
          })),
        },
      },
    });
  }
};
