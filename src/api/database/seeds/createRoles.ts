import { i18n } from 'i18next';
import { v4 } from 'uuid';
import { roleActions } from '../../data/permission/permission.entity.js';
import { BypassPrismaType } from '../prisma/client.js';
import { jpProject, usaProject } from './createProjects.js';

export const projectRoles = {
  [usaProject]: {
    language: 'en',
    admin: v4(),
    editor: v4(),
    contributor: v4(),
    viewer: v4(),
  },
  [jpProject]: {
    language: 'ja',
    admin: v4(),
    editor: v4(),
    contributor: v4(),
    viewer: v4(),
  },
};

export const createRoles = async (prisma: BypassPrismaType, i18next: i18n): Promise<void> => {
  const editorPermissions = [
    ...roleActions.post,
    'readProject',
    'readRole',
    'createRole',
    'readUser',
    ...roleActions.invitation,
    ...roleActions.review,
    'createApiKey',
    'readApiKey',
  ];

  const contributorPermissions = [
    'readOwnPost',
    'createPost',
    'updatePost',
    'publishPost',
    'readProject',
    'readRole',
    'readUser',
    'readOwnReview',
    'createReview',
    'closeReview',
  ];

  const viewerPermissions = ['readOwnPost'];

  const roles = [];
  for (const project of [usaProject, jpProject]) {
    const projectRole = projectRoles[project];
    i18next.changeLanguage(projectRole.language);

    // admin
    roles.push({
      id: projectRole.admin,
      name: i18next.t('seed.role.admin'),
      description: i18next.t('seed.role.admin_description'),
      isAdmin: true,
      projectId: project,
      permissions: [],
    });

    // editor
    roles.push({
      id: projectRole.editor,
      name: i18next.t('seed.role.editor'),
      description: i18next.t('seed.role.editor_description'),
      isAdmin: false,
      projectId: project,
      permissions: editorPermissions,
    });

    // contributor
    roles.push({
      id: projectRole.contributor,
      name: i18next.t('seed.role.contributor'),
      description: i18next.t('seed.role.contributor_description'),
      isAdmin: false,
      projectId: project,
      permissions: contributorPermissions,
    });

    // viewer
    roles.push({
      id: projectRole.viewer,
      name: i18next.t('seed.role.viewer'),
      description: i18next.t('seed.role.viewer_description'),
      isAdmin: false,
      projectId: project,
      permissions: viewerPermissions,
    });
  }

  for (const role of roles) {
    await prisma.role.create({
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
        isAdmin: role.isAdmin,
        projectId: role.projectId,
        rolePermissions: {
          create: role.permissions.map((permission) => ({
            id: v4(),
            projectId: role.projectId,
            permissionAction: permission,
          })),
        },
      },
    });
  }
};
