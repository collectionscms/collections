import process from 'process';
import { Output } from '../../../utilities/output.js';
// import { createProjectSetting } from './createProjectSetting.js';

export const seedProduction = async (email: string, password: string): Promise<void> => {
  // const usersService = new UsersService(prisma);
  // const rolesService = new RolesService(prisma);

  try {
    // Role
    // Output.info('Creating roles...');
    // const role = await rolesService.create({
    //   name: 'Administrator',
    //   description: 'Administrator',
    //   adminAccess: true,
    // });

    // // User
    // Output.info('Creating users...');
    // const hashed = await oneWayHash(password);

    // await usersService.create({
    //   name: 'admin',
    //   email,
    //   password: hashed,
    //   roleId: role!.id,
    // });

    // // Project
    // Output.info('Creating project settings...');
    // await createProjectSetting();

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  }
};
