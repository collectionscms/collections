import { Output } from '../../../utilities/output.js';
import { bypassPrisma } from '../prisma/client.js';
import { createAccess } from './createAccess.js';
import { createPost } from './createPosts.js';
import { createProjects, enProject, jaProject } from './createProjects.js';
import { createRoles } from './createRoles.js';
import { createUsers } from './createUsers.js';

export const seedDev = async (): Promise<void> => {
  try {
    await bypassPrisma.$transaction(async (tx) => {
      await createAccess(tx);
      await createProjects(tx);
      await createRoles(tx);
      await createUsers(tx);
      await createPost(tx, enProject, {
        defaultLocale: 'en',
      });
      await createPost(tx, jaProject, {
        defaultLocale: 'ja',
      });
    });

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  }
};
