import { Output } from '../../../utilities/output.js';
import { UsersRepository } from '../../repositories/users.js';
import { RolesService } from '../../services/roles.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { getDatabase } from '../connection.js';
import { getSchemaOverview } from '../overview.js';

export const seedProduction = async (email: string, password: string): Promise<void> => {
  const database = getDatabase();
  const schema = await getSchemaOverview({ database });
  const usersRepository = new UsersRepository();

  const rolesService = new RolesService({ database, schema });

  try {
    // Role
    Output.info('Creating roles...');
    await rolesService.createMany([
      { name: 'Administrator', description: 'Administrator', admin_access: true },
    ] as any[]);

    // User
    Output.info('Creating users...');
    const adminRole = await rolesService.readOne(1);
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
