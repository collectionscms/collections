import Output from '@scripts/utilities/output';
import { SuperfastField, SuperfastRole } from '@shared/types';
import { Knex } from 'knex';
import { getDatabase } from '../connection';

const seedDev = async (): Promise<void> => {
  const database = getDatabase();

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
  await database.schema.dropTable('Restaurant');
  await database.schema.dropTable('Company');
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
  const adminRole = await database<SuperfastRole>('superfast_roles')
    .select('id')
    .where('name', 'Administrator')
    .first();
  const editorRole = await database<SuperfastRole>('superfast_roles')
    .select('id')
    .where('name', 'Editor')
    .first();

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
  const restaurant = await database<SuperfastField>('superfast_collections')
    .select('id')
    .where('collection', 'Restaurant')
    .first();
  const company = await database<SuperfastField>('superfast_collections')
    .select('id')
    .where('collection', 'Company')
    .first();

  await database('superfast_fields').insert([
    // Fields related to collection Restaurant
    {
      id: 1,
      field: 'name',
      label: '名前',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 1,
      superfast_collection_id: restaurant!.id,
    },
    {
      id: 2,
      field: 'nick_name',
      label: 'ニックネーム',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 2,
      superfast_collection_id: restaurant!.id,
    },
    {
      id: 3,
      field: 'adress',
      label: '住所',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 3,
      superfast_collection_id: restaurant!.id,
    },
    // Fields related to collection Company
    {
      id: 4,
      field: 'name',
      label: '会社名',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 1,
      superfast_collection_id: company!.id,
    },
    {
      id: 5,
      field: 'phone_number',
      label: '電話番号',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 2,
      superfast_collection_id: company!.id,
    },
    {
      id: 6,
      field: 'adress',
      label: '住所',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 3,
      superfast_collection_id: company!.id,
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
    table.string('status', 64).notNullable();
    table.timestamps(true, true);
  });

  await database.schema.createTable('Company', function (table) {
    table.increments();
    table.string('status', 64).notNullable();
    table.timestamps(true, true);
  });
};

export default seedDev;
