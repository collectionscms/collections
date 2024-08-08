import { v4 } from 'uuid';
import { roleActions } from '../../data/permission/permission.entity.js';
import { BypassPrismaType } from '../prisma/client.js';
import { enProject, jaProject } from './createProjects.js';
import { adminUser } from './createUsers.js';

export const enEditorRole = v4();
export const jaEditorRole = v4();

export const createApiKeys = async (prisma: BypassPrismaType): Promise<void> => {
  const enProjectApiKeys = [
    {
      id: enEditorRole,
      name: 'Editor',
      isAdmin: false,
      projectId: enProject,
      permissions: roleActions.post,
    },
  ];

  const jaProjectApiKeys = [
    {
      id: jaEditorRole,
      name: 'エディター',
      isAdmin: false,
      projectId: jaProject,
      permissions: roleActions.post,
    },
  ];

  for (const role of [...enProjectApiKeys, ...jaProjectApiKeys]) {
    await prisma.apiKey.create({
      data: {
        key: v4(),
        id: role.id,
        name: role.name,
        projectId: role.projectId,
        createdById: adminUser,
        updatedById: adminUser,
        apiKeyPermissions: {
          create: role.permissions.map((permission) => ({
            id: v4(),
            projectId: role.projectId,
            permissionAction: permission,
          })),
        },
      },
    });
  }
};
