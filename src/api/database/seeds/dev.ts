import i18next from 'i18next';
import translation_en from '../../../lang/translations/en/translation.json' assert { type: 'json' };
import translation_ja from '../../../lang/translations/ja/translation.json' assert { type: 'json' };
import { Output } from '../../../utilities/output.js';
import { apiKeyActions, roleActions } from '../../persistence/permission/permission.entity.js';
import { bypassPrisma } from '../prisma/client.js';
import { createApiKeys } from './createApiKeys.js';
import { createPermissions } from './createPermissions.js';
import { createPost } from './createPost.js';
import { createProjects } from './createProjects.js';
import { createRole } from './createRoles.js';
import { createUsers } from './createUsers.js';
import { createWebhookSettings } from './createWebhookSettings.js';
import { apiKeys } from './data/apiKeys.js';
import { contents } from './data/contents.js';
import { enProject, jpProject, projects } from './data/projects.js';
import {
  editorPermissions,
  projectRoles,
  viewerPermissions,
  writerPermissions,
} from './data/roles.js';
import { users } from './data/users.js';
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
      // projects
      await createProjects(tx, projects);

      // permissions
      await createPermissions(tx, roleActions, apiKeyActions);

      // roles
      for (const projectId of [enProject, jpProject]) {
        const projectRole = projectRoles[projectId];
        i18next.changeLanguage(projectRole.language);

        // admin
        await createRole(tx, {
          id: projectRole.admin,
          name: i18next.t('seed.role.admin'),
          description: i18next.t('seed.role.admin_description'),
          isAdmin: true,
          projectId,
          permissions: [],
        });

        // editor
        await createRole(tx, {
          id: projectRole.editor,
          name: i18next.t('seed.role.editor'),
          description: i18next.t('seed.role.editor_description'),
          isAdmin: false,
          projectId,
          permissions: editorPermissions,
        });

        // writer
        await createRole(tx, {
          id: projectRole.writer,
          name: i18next.t('seed.role.writer'),
          description: i18next.t('seed.role.writer_description'),
          isAdmin: false,
          projectId,
          permissions: writerPermissions,
        });

        // viewer
        await createRole(tx, {
          id: projectRole.viewer,
          name: i18next.t('seed.role.viewer'),
          description: i18next.t('seed.role.viewer_description'),
          isAdmin: false,
          projectId,
          permissions: viewerPermissions,
        });
      }

      // users
      await createUsers(tx, users);

      // api keys
      await createApiKeys(tx, apiKeys);

      // posts
      await createPost(tx, enProject, [contents[0]]);
      await createPost(tx, jpProject, [contents[1]]);

      // webhook settings
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
