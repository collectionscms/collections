import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { BypassPrismaType } from '../prisma/client.js';
import { enProject, jaProject } from './createProjects.js';
import {
  enAdminRole,
  enContributorRole,
  enEditorRole,
  enViewerRole,
  jaAdminRole,
  jaContributorRole,
  jaEditorRole,
  jaViewerRole,
} from './createRoles.js';

export const adminUser = v4();
export const editorUser = v4();
export const contributorUser = v4();
export const viewerUser = v4();

export const createUsers = async (prisma: BypassPrismaType): Promise<void> => {
  const password = await oneWayHash('password');
  const users = [
    {
      id: adminUser,
      email: 'admin@collections.dev',
      userProjects: [
        {
          projectId: enProject,
          roleId: enAdminRole,
        },
        {
          projectId: jaProject,
          roleId: jaAdminRole,
        },
      ],
    },
    {
      id: editorUser,
      email: 'editor@collections.dev',
      userProjects: [
        {
          projectId: enProject,
          roleId: enEditorRole,
        },
        {
          projectId: jaProject,
          roleId: jaEditorRole,
        },
      ],
    },
    {
      id: contributorUser,
      email: 'contributor@collections.dev',
      userProjects: [
        {
          projectId: enProject,
          roleId: enContributorRole,
        },
        {
          projectId: jaProject,
          roleId: jaContributorRole,
        },
      ],
    },
    {
      id: viewerUser,
      email: 'viewer@collections.dev',
      userProjects: [
        {
          projectId: enProject,
          roleId: enViewerRole,
        },
        {
          projectId: jaProject,
          roleId: jaViewerRole,
        },
      ],
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: faker.person.firstName() + ' ' + faker.person.lastName(),
        email: user.email,
        avatarUrl: faker.image.avatar(),
        password: password,
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
