import process from 'process';
import { Output } from '../../../utilities/output.js';
import { bypassPrisma } from '../prisma/client.js';
import { createPermissions } from './createPermissions.js';
import { adminUser, createUsers } from './createUsers.js';

export const seedProduction = async (email: string, password: string): Promise<void> => {
  try {
    await bypassPrisma.$transaction(async (tx) => {
      Output.info('Creating permissions...');
      await createPermissions(tx);

      Output.info('Creating users...');
      await createUsers(tx, [
        {
          id: adminUser,
          email: email,
          password: password,
          userProjects: [],
        },
      ]);
    });

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  }
};
