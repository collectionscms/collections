import { faker } from '@faker-js/faker';
import { v4 as uuidV4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { prisma } from '../prisma/client.js';
import { globalProject } from './createProject.js';
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
          roleId: adminRole,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'admin@collections.dev',
          avatarUrl: faker.internet.avatar(),
          password: password,
          isActive: true,
          apiKey: uuidV4(),
        },
        {
          id: editorUser,
          roleId: editorRole,
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          email: 'editor@collections.dev',
          avatarUrl: faker.internet.avatar(),
          password: password,
          isActive: true,
          apiKey: uuidV4(),
        },
        {
          id: guestUser,
          roleId: guestRole,
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
        },
        {
          projectId: globalProject,
          userId: editorUser,
        },
        {
          projectId: globalProject,
          userId: guestUser,
        },
      ],
    });
  });
};
