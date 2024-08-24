import { roleActions, apiKeyActions } from '../../persistence/permission/permission.entity.js';
import { BypassPrismaType } from '../prisma/client.js';

export const createPermissions = async (prisma: BypassPrismaType): Promise<void> => {
  await prisma.permission.createMany({
    data: [
      // role permissions
      ...Object.entries(roleActions).flatMap(([group, actions]) =>
        actions.map((action, i) => ({
          action,
          group,
          displayOrder: i,
        }))
      ),

      // api key permissions
      ...Object.entries(apiKeyActions).flatMap(([group, actions]) =>
        actions.map((action, i) => ({
          action,
          group,
          displayOrder: i,
        }))
      ),
    ],
  });
};
