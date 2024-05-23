import { Output } from '../../../utilities/output.js';
import { status } from '../../data/post/post.entity.js';
import { bypassPrisma } from '../prisma/client.js';
import { createPermissions } from './createPermissions.js';
import { createPost } from './createPost.js';
import { createProjects, enProject, jaProject } from './createProjects.js';
import { createRoles } from './createRoles.js';
import { createUsers } from './createUsers.js';

export const seedDev = async (): Promise<void> => {
  try {
    await bypassPrisma.$transaction(async (tx) => {
      await createProjects(tx);
      await createPermissions(tx);
      await createRoles(tx);
      await createUsers(tx);

      for (const project of [enProject, jaProject]) {
        await createPost(tx, project, {
          status: status.draft,
          defaultLocale: project === enProject ? 'en' : 'ja',
        });

        await createPost(tx, project, {
          status: status.published,
          defaultLocale: project === enProject ? 'en' : 'ja',
        });

        await createPost(tx, project, {
          status: status.archived,
          defaultLocale: project === enProject ? 'en' : 'ja',
        });
      }
    });

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  }
};
