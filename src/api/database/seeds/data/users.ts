import { v4 } from 'uuid';
import { enProject, jpProject } from './projects.js';
import { projectRoles } from './roles.js';

// Fixed to avoid mismatch between session and user id.
export const adminUser = '1bc49902-bee5-4c90-b87a-3254d5c7e504';
export const editorUser = '513a1cb6-68d9-4618-bc6d-4bb2c3b54048';
export const contributorUser = 'ea23ce3d-b236-41b8-9696-7b2a6377451f';
export const viewerUser = 'f3d75e36-387b-459c-a227-83c7a0c54a1a';

export const users = [
  {
    id: adminUser,
    email: 'admin@collections.dev',
    password: 'password',
    confirmationToken: v4(),
    confirmedAt: new Date(),
    userProjects: [
      {
        projectId: enProject,
        roleId: projectRoles[enProject].admin,
      },
      {
        projectId: jpProject,
        roleId: projectRoles[jpProject].admin,
      },
    ],
  },
  {
    id: editorUser,
    email: 'editor@collections.dev',
    password: 'password',
    confirmationToken: v4(),
    confirmedAt: new Date(),
    userProjects: [
      {
        projectId: enProject,
        roleId: projectRoles[enProject].editor,
      },
      {
        projectId: jpProject,
        roleId: projectRoles[jpProject].editor,
      },
    ],
  },
  {
    id: contributorUser,
    email: 'contributor@collections.dev',
    password: 'password',
    confirmationToken: v4(),
    confirmedAt: new Date(),
    userProjects: [
      {
        projectId: enProject,
        roleId: projectRoles[enProject].contributor,
      },
      {
        projectId: jpProject,
        roleId: projectRoles[jpProject].contributor,
      },
    ],
  },
  {
    id: viewerUser,
    email: 'viewer@collections.dev',
    password: 'password',
    confirmationToken: v4(),
    confirmedAt: new Date(),
    userProjects: [
      {
        projectId: enProject,
        roleId: projectRoles[enProject].viewer,
      },
      {
        projectId: jpProject,
        roleId: projectRoles[jpProject].viewer,
      },
    ],
  },
];
