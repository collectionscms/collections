import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { bypassPrisma } from '../prisma/client.js';
import { jaProject, enProject } from './createProjects.js';
import {
  jaAdminRole,
  jaEditorRole,
  jaGuestRole,
  enAdminRole,
  enEditorRole,
  enGuestRole,
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
          avatarUrl: faker.image.avatar(),
          password: password,
          isActive: true,
          confirmationToken: v4(),
          confirmedAt: new Date(),
        },
        {
          id: editorUser,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'editor@collections.dev',
          avatarUrl: faker.image.avatar(),
          password: password,
          isActive: true,
          confirmationToken: v4(),
          confirmedAt: new Date(),
        },
        {
          id: guestUser,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'guest@collections.dev',
          avatarUrl: faker.image.avatar(),
          password: password,
          isActive: true,
          confirmationToken: v4(),
          confirmedAt: new Date(),
        },
      ],
    });

    await tx.userProject.createMany({
      data: [
        // US Project
        {
          id: v4(),
          projectId: enProject,
          userId: adminUser,
          roleId: enAdminRole,
        },
        {
          id: v4(),
          projectId: enProject,
          userId: editorUser,
          roleId: enEditorRole,
        },
        {
          id: v4(),
          projectId: enProject,
          userId: guestUser,
          roleId: enGuestRole,
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
