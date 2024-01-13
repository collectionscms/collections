import { prisma } from '../prisma/client.js';

export const adminRoleId = '20000000-0000-0000-0000-000000000001';
export const editorRoleId = '20000000-0000-0000-0000-000000000002';
export const guestRoleId = '20000000-0000-0000-0000-000000000003';

export const createRoles = async (): Promise<void> => {
  await prisma.role.createMany({
    data: [
      {
        id: adminRoleId,
        name: 'Administrator',
        description: 'Administrator',
        adminAccess: true,
      },
      {
        id: editorRoleId,
        name: 'Editor',
        description: 'Editor',
        adminAccess: false,
      },
      {
        id: guestRoleId,
        name: 'Guest',
        description: 'Guest',
        adminAccess: false,
      },
    ],
  });
};
