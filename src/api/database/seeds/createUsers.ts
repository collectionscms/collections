import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { bypassPrisma } from '../prisma/client.js';
import { jaProject, usProject } from './createProjects.js';
import {
  jaAdminRole,
  jaEditorRole,
  jaGuestRole,
  usAdminRole,
  usEditorRole,
  usGuestRole,
} from './createRoles.js';

export const adminUser = v4();
export const editorUser = v4();
export const guestUser = v4();

export const createUsers = async (): Promise<void> => {
  const password = await oneWayHash('password');

  await bypassPrisma.$transaction(async (tx) => {
    await tx.user.createMany({
      data: [
        {
          id: adminUser,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'admin@collections.dev',
          avatarUrl: faker.internet.avatar(),
          password: password,
          isActive: true,
        },
        {
          id: editorUser,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'editor@collections.dev',
          avatarUrl: faker.internet.avatar(),
          password: password,
          isActive: true,
        },
        {
          id: guestUser,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'guest@collections.dev',
          avatarUrl: faker.internet.avatar(),
          password: password,
          isActive: true,
        },
      ],
    });

    await tx.userProject.createMany({
      data: [
        // US Project
        {
          id: v4(),
          projectId: usProject,
          userId: adminUser,
          roleId: usAdminRole,
        },
        {
          id: v4(),
          projectId: usProject,
          userId: editorUser,
          roleId: usEditorRole,
        },
        {
          id: v4(),
          projectId: usProject,
          userId: guestUser,
          roleId: usGuestRole,
        },
        // JA Project
        {
          id: v4(),
          projectId: jaProject,
          userId: adminUser,
          roleId: jaAdminRole,
        },
        {
          id: v4(),
          projectId: jaProject,
          userId: editorUser,
          roleId: jaEditorRole,
        },
        {
          id: v4(),
          projectId: jaProject,
          userId: guestUser,
          roleId: jaGuestRole,
        },
      ],
    });
  });
};
