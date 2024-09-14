import i18next from 'i18next';
import translation_en from '../../../lang/translations/en/translation.json' assert { type: 'json' };
import translation_ja from '../../../lang/translations/ja/translation.json' assert { type: 'json' };
import { Output } from '../../../utilities/output.js';
import { bypassPrisma } from '../prisma/client.js';
import { createApiKeys } from './createApiKeys.js';
import { createPermissions } from './createPermissions.js';
import { createPost } from './createPost.js';
import { createProjects, enProject, jpProject } from './createProjects.js';
import { createRoles, projectRoles } from './createRoles.js';
import { adminUser, contributorUser, createUsers, editorUser, viewerUser } from './createUsers.js';
import { createWebhookSettings } from './createWebhookSettings.js';
import { contents } from './data/contents.js';
import { webhookSettings } from './data/webhookSettings.js';

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
      await createPost(tx, enProject, contents);
      await createPost(tx, jpProject, contents);
      await createWebhookSettings(tx, [
        ...webhookSettings(enProject),
        ...webhookSettings(jpProject),
      ]);
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

  return users;
}
