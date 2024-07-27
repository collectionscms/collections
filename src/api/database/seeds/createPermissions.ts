import { actions } from '../../data/permission/permission.entity.js';
import { BypassPrismaType } from '../prisma/client.js';

export const createPermissions = async (prisma: BypassPrismaType): Promise<void> => {
  await prisma.permission.createMany({
    data: [
      ...Object.entries(actions).flatMap(([group, actions]) =>
        actions.map((action, i) => ({
          action,
          group,
          displayOrder: i,
        }))
      ),
    ],
  });
};
