import i18next from 'i18next';
import translation_en from '../../../lang/translations/en/translation.json' assert { type: 'json' };
import translation_ja from '../../../lang/translations/ja/translation.json' assert { type: 'json' };
import { Output } from '../../../utilities/output.js';
import { bypassPrisma } from '../prisma/client.js';
import { createApiKeys } from './createApiKeys.js';
import { createPermissions } from './createPermissions.js';
import { createPost } from './createPost.js';
import { createProjects, jpProject, usaProject } from './createProjects.js';
import { createRoles, projectRoles } from './createRoles.js';
import { adminUser, contributorUser, createUsers, editorUser, viewerUser } from './createUsers.js';
import { posts } from './data/posts.js';

i18next.init({
  resources: {
    ja: {
      translation: translation_ja,
    },
    en: {
      translation: translation_en,
    },
  },
});

export const seedDev = async (): Promise<void> => {
  try {
    await bypassPrisma.$transaction(async (tx) => {
      await createProjects(tx);
      await createPermissions(tx);
      await createRoles(tx, i18next);
      await createUsers(tx, getUsers());
      await createApiKeys(tx);
      await createPost(tx, usaProject, posts);
      await createPost(tx, jpProject, posts);
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
          roleId: projectRoles[usaProject].admin,
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
      userProjects: [
        {
          projectId: usaProject,
          roleId: projectRoles[usaProject].editor,
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
      userProjects: [
        {
          projectId: usaProject,
          roleId: projectRoles[usaProject].contributor,
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
      userProjects: [
        {
          projectId: usaProject,
          roleId: projectRoles[usaProject].viewer,
        },
        {
          projectId: jpProject,
          roleId: projectRoles[jpProject].viewer,
        },
      ],
    },
  ];

  return users;
}
