import { v4 } from 'uuid';
import { BypassPrismaType } from '../prisma/client.js';

export const createRole = async (
  prisma: BypassPrismaType,
  role: {
    id: string;
    name: string;
    description: string;
    isAdmin: boolean;
    projectId: string;
    permissions: string[];
  }
): Promise<void> => {
  await prisma.role.create({
    data: {
      id: role.id,
      name: role.name,
      description: role.description,
      isAdmin: role.isAdmin,
      projectId: role.projectId,
      rolePermissions: {
        create: role.permissions.map((permission) => ({
          id: v4(),
          projectId: role.projectId,
          permissionAction: permission,
        })),
      },
    },
  });
};
