import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { BypassPrismaType } from '../prisma/client.js';

export const createUsers = async (
  prisma: BypassPrismaType,
  users: {
    id: string;
    email: string;
    password: string;
    confirmationToken: string | null;
    confirmedAt: Date | null;
    userProjects: { projectId: string; roleId: string }[];
  }[]
): Promise<void> => {
  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: faker.person.firstName() + ' ' + faker.person.lastName(),
        email: user.email,
        password: await oneWayHash(user.password),
        isActive: true,
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
