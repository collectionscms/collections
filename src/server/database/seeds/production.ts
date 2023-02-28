import Output from '../../../scripts/utilities/output';
import { oneWayHash } from '../../../server/utilities/oneWayHash';
import { getDatabase } from '../connection';

const seedProduction = async (email: string, password: string): Promise<void> => {
  const database = await getDatabase();

  try {
    // Role
    Output.info('Creating roles...');
    await database('superfast_roles').insert([
      { name: 'Administrator', description: 'Administrator', admin_access: true },
    ]);

    // User
    Output.info('Creating users...');
    const adminRole = await database('superfast_roles')
      .select('id')
      .where('name', 'Administrator')
      .first();

    // Password
    const hashed = await oneWayHash(password);

    await database('superfast_users').insert([
      {
        first_name: 'Admin',
        last_name: 'User',
        user_name: 'admin',
        email: email,
        password: hashed,
        is_active: true,
        superfast_role_id: adminRole!.id,
      },
    ]);

    // Project
    Output.info('Creating project settings...');
    await database('superfast_project_settings').insert([{ name: 'Superfast' }]);

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  } finally {
    database.destroy();
  }
};

export default seedProduction;
