import { Output } from '../../../utilities/output.js';
import { RolesService } from '../../services/roles.js';
import { UsersService } from '../../services/users.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { getDatabase } from '../connection.js';
import { getSchemaOverview } from '../overview.js';

export const seedProduction = async (email: string, password: string): Promise<void> => {
  const database = getDatabase();
  const schema = await getSchemaOverview({ database });
  const usersService = new UsersService({ database, schema });
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

    await usersService.createMany([
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
    await database('collections_project_settings').insert([
      { name: 'Collections', before_login: '', after_login: '' },
    ]);

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  } finally {
    database.destroy();
  }
};
