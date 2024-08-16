import { Output } from '../../../utilities/output.js';
import { contentStatus } from '../../data/content/content.entity.js';
import { bypassPrisma } from '../prisma/client.js';
import { createApiKeys } from './createApiKeys.js';
import { createPermissions } from './createPermissions.js';
import { createPost } from './createPost.js';
import { createProjects, usaProject, jpProject } from './createProjects.js';
import {
  createRoles,
  enAdminRole,
  enContributorRole,
  enEditorRole,
  enViewerRole,
  jaAdminRole,
  jaContributorRole,
  jaEditorRole,
  jaViewerRole,
} from './createRoles.js';
import { adminUser, contributorUser, createUsers, editorUser, viewerUser } from './createUsers.js';

export const seedDev = async (): Promise<void> => {
  try {
    await bypassPrisma.$transaction(async (tx) => {
      await createProjects(tx);
      await createPermissions(tx);
      await createRoles(tx);
      await createUsers(tx, getUsers());
      await createApiKeys(tx);

      for (const project of [usaProject, jpProject]) {
        // draft
        await createPost(tx, project, {
          status: contentStatus.draft,
          language: project === usaProject ? 'en' : 'ja',
        });

        // review
        await createPost(tx, project, {
          status: contentStatus.review,
          language: project === usaProject ? 'en' : 'ja',
        });

        // published
        await createPost(tx, project, {
          status: contentStatus.published,
          language: project === usaProject ? 'en' : 'ja',
          publishedAt: new Date(),
        });

        // archived
        await createPost(tx, project, {
          status: contentStatus.archived,
          language: project === usaProject ? 'en' : 'ja',
        });
      }
    });

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  }
};

function getUsers() {
  const users = [
    {
      id: adminUser,
      email: 'admin@collections.dev',
      password: 'password',
      userProjects: [
        {
          projectId: usaProject,
          roleId: enAdminRole,
        },
        {
          projectId: jpProject,
          roleId: jaAdminRole,
        },
      ],
    },
    {
      id: editorUser,
      email: 'editor@collections.dev',
      password: 'password',
      userProjects: [
        {
          projectId: usaProject,
          roleId: enEditorRole,
        },
        {
          projectId: jpProject,
          roleId: jaEditorRole,
        },
      ],
    },
    {
      id: contributorUser,
      email: 'contributor@collections.dev',
      password: 'password',
      userProjects: [
        {
          projectId: usaProject,
          roleId: enContributorRole,
        },
        {
          projectId: jpProject,
          roleId: jaContributorRole,
        },
      ],
    },
    {
      id: viewerUser,
      email: 'viewer@collections.dev',
      password: 'password',
      userProjects: [
        {
          projectId: usaProject,
          roleId: enViewerRole,
        },
        {
          projectId: jpProject,
          roleId: jaViewerRole,
        },
      ],
    },
  ];

  return users;
}
