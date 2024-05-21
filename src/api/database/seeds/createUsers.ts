import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { BypassPrismaType } from '../prisma/client.js';
import { enProject, jaProject } from './createProjects.js';
import {
  enAdminRole,
  enEditorRole,
  enGuestRole,
  jaAdminRole,
  jaEditorRole,
  jaGuestRole,
} from './createRoles.js';

export const adminUser = v4();
export const editorUser = v4();
export const guestUser = v4();

export const createUsers = async (prisma: BypassPrismaType): Promise<void> => {
  const password = await oneWayHash('password');

  await prisma.user.createMany({
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

  await prisma.userProject.createMany({
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
};
