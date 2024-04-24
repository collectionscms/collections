import { v4 } from 'uuid';
import { prisma } from '../prisma/client.js';
import { jaProject, usProject } from './createProjects.js';

export const usAdminRole = v4();
export const usEditorRole = v4();
export const usGuestRole = v4();
export const jaAdminRole = v4();
export const jaEditorRole = v4();
export const jaGuestRole = v4();

export const createRoles = async (): Promise<void> => {
  await prisma.role.createMany({
    data: [
      // US Project
      {
        id: usAdminRole,
        projectId: usProject,
        name: 'Administrator',
        description: 'Administrator',
      },
      {
        id: usEditorRole,
        projectId: usProject,
        name: 'Editor',
        description: 'Editor',
      },
      {
        id: usGuestRole,
        projectId: usProject,
        name: 'Guest',
        description: 'Guest',
      },
      // Ja Project
      {
        id: jaAdminRole,
        projectId: jaProject,
        name: 'Administrator',
        description: 'Administrator',
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
