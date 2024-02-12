import { faker } from '@faker-js/faker';
import { v4 as uuidV4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { prisma } from '../prisma/client.js';
import { globalProject } from './createProjects.js';
import { adminRole, editorRole, guestRole } from './createRoles.js';

export const adminUser = '10000000-2000-1000-0000-000000000001';
export const editorUser = '10000000-2000-1000-0000-000000000002';
export const guestUser = '10000000-2000-1000-0000-000000000003';

export const createUsers = async (): Promise<void> => {
  const password = await oneWayHash('password');

  await prisma.$transaction(async (tx) => {
    await tx.user.createMany({
      data: [
        // Global Project
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
        // Global Project
        {
          projectId: globalProject,
          userId: adminUser,
          roleId: adminRole,
          isAdmin: true,
        },
        {
          projectId: globalProject,
          userId: editorUser,
          roleId: editorRole,
          isAdmin: false,
        },
        {
          projectId: globalProject,
          userId: guestUser,
          roleId: guestRole,
          isAdmin: false,
        },
      ],
    });
  });
};
