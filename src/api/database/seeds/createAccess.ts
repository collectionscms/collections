import { BypassPrismaType } from '../prisma/client.js';

export const createAccess = async (prisma: BypassPrismaType): Promise<void> => {
  await prisma.access.createMany({
    data: [
      {
        action: 'read_post',
        group: 'post',
        displayOrder: 0,
      },
      {
        action: 'create_post',
        group: 'post',
        displayOrder: 1,
      },
      {
        action: 'update_post',
        group: 'post',
        displayOrder: 2,
      },
      {
        action: 'delete_post',
        group: 'post',
        displayOrder: 3,
      },
    ],
  });
};
