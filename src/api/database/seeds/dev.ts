import { Output } from '../../../utilities/output.js';
import { createProjects } from './createProject.js';
import { createRoles } from './createRoles.js';
import { createUsers } from './createUsers.js';

export const seedDev = async (): Promise<void> => {
  try {
    await createProjects();
    await createRoles();
    await createUsers();

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  }
};
