import { prisma } from '../prisma/client.js';
import { globalProject } from './createProject.js';

export const adminRole = '10000000-2000-0000-0000-000000000001';
export const editorRole = '10000000-2000-0000-0000-000000000002';
export const guestRole = '10000000-2000-0000-0000-000000000003';

export const createRoles = async (): Promise<void> => {
  await prisma.role.createMany({
    data: [
      // Global Project
      {
        id: adminRole,
        projectId: globalProject,
        name: 'Administrator',
        description: 'Administrator',
        adminAccess: true,
      },
      {
        id: editorRole,
        projectId: globalProject,
        name: 'Editor',
        description: 'Editor',
        adminAccess: false,
      },
      {
        id: guestRole,
        projectId: globalProject,
        name: 'Guest',
        description: 'Guest',
        adminAccess: false,
      },
    ],
  });
};
