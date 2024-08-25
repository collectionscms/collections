import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { BypassPrismaType } from '../prisma/client.js';

// Fixed to avoid mismatch between session and user id.
export const adminUser = '1bc49902-bee5-4c90-b87a-3254d5c7e504';
export const editorUser = '513a1cb6-68d9-4618-bc6d-4bb2c3b54048';
export const contributorUser = 'ea23ce3d-b236-41b8-9696-7b2a6377451f';
export const viewerUser = 'f3d75e36-387b-459c-a227-83c7a0c54a1a';

export const createUsers = async (
  prisma: BypassPrismaType,
  users: {
    id: string;
    email: string;
    password: string;
    userProjects: { projectId: string; roleId: string }[];
  }[]
): Promise<void> => {
  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: faker.person.firstName() + ' ' + faker.person.lastName(),
        email: user.email,
        avatarUrl: faker.image.avatarGitHub(),
        password: await oneWayHash(user.password),
        isActive: true,
        confirmationToken: v4(),
        confirmedAt: new Date(),
        userProjects: {
          create: user.userProjects.map((userProject) => ({
            id: v4(),
            projectId: userProject.projectId,
            roleId: userProject.roleId,
          })),
        },
      },
    });
  }
};
