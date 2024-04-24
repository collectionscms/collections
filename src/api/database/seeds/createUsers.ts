import { faker } from '@faker-js/faker';
import { v4 as uuidV4, v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { prisma } from '../prisma/client.js';
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

  await prisma.$transaction(async (tx) => {
    await tx.user.createMany({
      data: [
        {
          id: adminUser,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'admin@collections.dev',
          avatarUrl: faker.internet.avatar(),
          password: password,
          isActive: true,
          apiKey: uuidV4(),
        },
        {
          id: editorUser,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'editor@collections.dev',
          avatarUrl: faker.internet.avatar(),
          password: password,
          isActive: true,
          apiKey: uuidV4(),
        },
        {
          id: guestUser,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'guest@collections.dev',
          avatarUrl: faker.internet.avatar(),
          password: password,
          isActive: true,
          apiKey: uuidV4(),
        },
      ],
    });

    await tx.userProject.createMany({
      data: [
        // US Project
        {
          projectId: usProject,
          userId: adminUser,
          roleId: usAdminRole,
          isAdmin: true,
        },
        {
          projectId: usProject,
          userId: editorUser,
          roleId: usEditorRole,
          isAdmin: false,
        },
        {
          projectId: usProject,
          userId: guestUser,
          roleId: usGuestRole,
          isAdmin: false,
        },
        // JA Project
        {
          projectId: jaProject,
          userId: adminUser,
          roleId: jaAdminRole,
          isAdmin: true,
        },
        {
          projectId: jaProject,
          userId: editorUser,
          roleId: jaEditorRole,
          isAdmin: false,
        },
        {
          projectId: jaProject,
          userId: guestUser,
          roleId: jaGuestRole,
          isAdmin: false,
        },
      ],
    });
  });
};
