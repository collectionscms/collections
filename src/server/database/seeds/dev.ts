import Output from '@scripts/utilities/output';
import { Knex } from 'knex';
import { getDatabase } from '../connection';

const seedDev = async (): Promise<void> => {
  const database = await getDatabase();

  try {
    await resetAll(database);
    await seedingData(database);
    await createCollectionTables(database);

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  } finally {
    database.destroy();
  }
};

const resetAll = async (database: Knex): Promise<void> => {
  await database('superfast_roles').delete();
  await database('superfast_users').delete();
  await database('superfast_permissions').delete();
  await database('superfast_collections').delete();
  await database('superfast_fields').delete();
  await database('superfast_field_options').delete();
  await database('superfast_relations').delete();
  await database('superfast_project_settings').delete();
  await database.schema.dropTableIfExists('Restaurant');
  await database.schema.dropTableIfExists('Company');
};

const seedingData = async (database: Knex): Promise<void> => {
  // Role
  Output.info('Creating roles...');
  await database('superfast_roles').insert([
    { id: 1, name: 'Administrator', description: '管理者', admin_access: true },
    { id: 2, name: 'Editor', description: '編集者', admin_access: false },
  ]);

  // User
  Output.info('Creating users...');
  const adminRole = await database('superfast_roles')
    .select('id')
    .where('name', 'Administrator')
    .first();
  const editorRole = await database('superfast_roles').select('id').where('name', 'Editor').first();

  await database('superfast_users').insert([
    {
      id: 1,
      first_name: '花子',
      last_name: '山田',
      user_name: 'hanako',
      email: 'hanako-yamada@example.com',
      password: 'hanako-xxxxxxxxx',
      is_active: true,
      superfast_role_id: adminRole!.id,
    },
    {
      id: 2,
      first_name: '太郎',
      last_name: '田中',
      user_name: 'taro',
      email: 'taro-tanaka@example.com',
      password: 'taro-xxxxxxxxx',
      is_active: false,
      superfast_role_id: editorRole!.id,
    },
  ]);

  // Permission
  Output.info('Creating permissions...');
  await database('superfast_permissions').insert([
    // Administrator
    {
      id: 1,
      collection: 'Restaurant',
      action: 'read',
      superfast_role_id: adminRole!.id,
    },
    {
      id: 2,
      collection: 'Restaurant',
      action: 'create',
      superfast_role_id: adminRole!.id,
    },
    {
      id: 3,
      collection: 'Restaurant',
      action: 'update',
      superfast_role_id: adminRole!.id,
    },
    {
      id: 4,
      collection: 'Company',
      action: 'read',
      superfast_role_id: adminRole!.id,
    },
    {
      id: 5,
      collection: 'Company',
      action: 'create',
      superfast_role_id: adminRole!.id,
    },
    {
      id: 6,
      collection: 'Company',
      action: 'update',
      superfast_role_id: adminRole!.id,
    },
    // Edditor
    {
      id: 7,
      collection: 'Restaurant',
      action: 'read',
      superfast_role_id: editorRole!.id,
    },
    {
      id: 8,
      collection: 'Company',
      action: 'read',
      superfast_role_id: editorRole!.id,
    },
  ]);

  // Collection
  Output.info('Creating collections...');
  await database('superfast_collections').insert([
    {
      id: 1,
      collection: 'Restaurant',
      singleton: false,
      hidden: false,
    },
    {
      id: 2,
      collection: 'Company',
      singleton: true,
      hidden: false,
    },
  ]);

  // Field
  Output.info('Creating fields...');
  const restaurant = await database('superfast_collections')
    .select('id')
    .where('collection', 'Restaurant')
    .first();
  const company = await database('superfast_collections')
    .select('id')
    .where('collection', 'Company')
    .first();

  await database('superfast_fields').insert([
    // Fields related to collection Restaurant
    {
      id: 1,
      collection: 'Restaurant',
      field: 'id',
      label: 'id',
      special: null,
      interface: 'input',
      readonly: true,
      required: true,
      hidden: true,
      sort: 1,
    },
    {
      id: 2,
      collection: 'Restaurant',
      field: 'name',
      label: '名前',
      special: null,
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 2,
    },
    {
      id: 3,
      collection: 'Restaurant',
      field: 'nick_name',
      label: 'ニックネーム',
      special: null,
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 3,
    },
    {
      id: 4,
      collection: 'Restaurant',
      field: 'adress',
      label: '住所',
      special: null,
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 4,
    },
    // Fields related to collection Company
    {
      id: 5,
      collection: 'Company',
      field: 'id',
      label: 'id',
      special: null,
      interface: 'input',
      readonly: true,
      required: true,
      hidden: true,
      sort: 1,
    },
    {
      id: 6,
      collection: 'Company',
      field: 'name',
      label: '会社名',
      special: null,
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 2,
    },
    {
      id: 7,
      collection: 'Company',
      field: 'phone_number',
      label: '電話番号',
      special: null,
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 3,
    },
    {
      id: 8,
      collection: 'Company',
      field: 'adress',
      label: '住所',
      special: null,
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 4,
    },
  ]);

  // Relation
  Output.info('Creating relations...');
  await database('superfast_relations').insert([
    {
      id: 1,
      many_collection: 'Restaurant',
      many_field: 'restaurant_id',
      one_collection: 'Company',
      one_field: 'relational_one_to_many',
    },
  ]);

  // Project Setting
  Output.info('Creating project settings...');
  await database('superfast_project_settings').insert([
    {
      id: 1,
      name: 'Superfast',
    },
  ]);
};

const createCollectionTables = async (database: Knex): Promise<void> => {
  Output.info('Creating collection tables...');
  await database.schema.createTable('Restaurant', function (table) {
    table.increments();
    table.string('name', 255);
    table.string('nick_name', 255);
    table.string('adress', 255);
    table.timestamps(true, true);
  });

  await database.schema.createTable('Company', function (table) {
    table.increments();
    table.string('name', 255);
    table.string('phone_number', 255);
    table.string('adress', 255);
    table.timestamps(true, true);
  });
};

export default seedDev;
