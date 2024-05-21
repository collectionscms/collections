import { v4 } from 'uuid';
import { bypassPrisma } from '../prisma/client.js';
import { jaProject, enProject } from './createProjects.js';

export const enAdminRole = v4();
export const enEditorRole = v4();
export const enGuestRole = v4();
export const jaAdminRole = v4();
export const jaEditorRole = v4();
export const jaGuestRole = v4();

export const createRoles = async (): Promise<void> => {
  await bypassPrisma.role.createMany({
    data: [
      // EN Project
      {
        id: enAdminRole,
        projectId: enProject,
        name: 'Administrator',
        description: 'Administrator',
        isAdmin: true,
      },
      {
        id: enEditorRole,
        projectId: enProject,
        name: 'Editor',
        description: 'Editor',
      },
      {
        id: enGuestRole,
        projectId: enProject,
        name: 'Guest',
        description: 'Guest',
      },
      // JA Project
      {
        id: jaAdminRole,
        projectId: jaProject,
        name: 'Administrator',
        description: 'Administrator',
        isAdmin: true,
      },
      {
        id: jaEditorRole,
        projectId: jaProject,
        name: 'Editor',
        description: 'Editor',
      },
      {
        id: jaGuestRole,
        projectId: jaProject,
        name: 'Guest',
        description: 'Guest',
      },
    ],
  });
};
