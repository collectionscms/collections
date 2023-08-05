import { Output } from '../../../utilities/output.js';
import { RolesRepository } from '../../repositories/roles.js';
import { UsersRepository } from '../../repositories/users.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { getDatabase } from '../connection.js';

export const seedProduction = async (email: string, password: string): Promise<void> => {
  const database = getDatabase();
  const rolesRepository = new RolesRepository();
  const usersRepository = new UsersRepository();

  try {
    // Role
    Output.info('Creating roles...');
    await rolesRepository.createMany([
      { name: 'Administrator', description: 'Administrator', admin_access: true },
    ] as any[]);

    // User
    Output.info('Creating users...');
    const adminRole = await rolesRepository.readOne(1);
    const hashed = await oneWayHash(password);

    await usersRepository.createMany([
      {
        name: 'admin',
        email,
        password: hashed,
        is_active: true,
        role_id: adminRole!.id,
      },
    ] as any[]);

    // Project
    Output.info('Creating project settings...');
    await database('superfast_project_settings').insert([
      { name: 'Superfast', before_login: '', after_login: '' },
    ]);

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  } finally {
    database.destroy();
  }
};
