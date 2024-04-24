import { Output } from '../../../utilities/output.js';
import { createOrganizations } from './createOrganizations.js';
import { createPost } from './createPost.js';
import { createProjects, jaProject, usProject } from './createProjects.js';
import { createRoles } from './createRoles.js';
import { createUsers } from './createUsers.js';

export const seedDev = async (): Promise<void> => {
  try {
    await createOrganizations();
    await createProjects();
    await createRoles();
    await createUsers();
    await createPost(usProject);
    await createPost(jaProject);

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  }
};
