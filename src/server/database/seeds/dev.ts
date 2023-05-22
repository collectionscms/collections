import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { oneWayHash } from '../../../server/utilities/oneWayHash.js';
import { Output } from '../../../utilities/output.js';
import { CollectionsRepository } from '../../repositories/collections.js';
import { ContentsRepository } from '../../repositories/contents.js';
import { FieldsRepository } from '../../repositories/fields.js';
import { PermissionsRepository } from '../../repositories/permissions.js';
import { ProjectSettingsRepository } from '../../repositories/projectSettings.js';
import { RolesRepository } from '../../repositories/roles.js';
import { UsersRepository } from '../../repositories/users.js';
import { getDatabase } from '../connection.js';

export const seedDev = async (): Promise<void> => {
  const database = getDatabase();

  try {
    await resetAll(database);
    await seedingData();
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
  await database('superfast_relations').delete();
  await database('superfast_project_settings').delete();
  await database.schema.dropTableIfExists('post');
  await database.schema.dropTableIfExists('company');
};

const seedingData = async (): Promise<void> => {
  const rolesRepository = new RolesRepository();
  const usersRepository = new UsersRepository();
  const permissionsRepository = new PermissionsRepository();
  const collectionsRepository = new CollectionsRepository();
  const fieldsRepository = new FieldsRepository();
  const projectSettingsRepository = new ProjectSettingsRepository();

  // Role
  Output.info('Creating roles...');
  await rolesRepository.createMany([
    { id: 1, name: 'Administrator', description: '管理者', admin_access: true },
    { id: 2, name: 'Editor', description: '編集者', admin_access: false },
  ] as any[]);

  // User
  Output.info('Creating users...');
  const adminRole = await rolesRepository.readOne(1);
  const editorRole = await rolesRepository.readOne(2);
  const password = await oneWayHash('password');

  await usersRepository.createMany([
    {
      id: 1,
      first_name: 'User',
      last_name: 'Admin',
      user_name: 'admin',
      email: 'admin@example.com',
      password,
      is_active: true,
      role_id: adminRole.id,
    },
    {
      id: 2,
      first_name: 'User',
      last_name: 'Editor',
      user_name: 'editor',
      email: 'editor@example.com',
      password,
      is_active: false,
      api_key: uuidv4(),
      role_id: editorRole.id,
    },
  ] as any[]);

  // Permission
  Output.info('Creating permissions...');
  await permissionsRepository.createMany([
    // Editor
    {
      id: 1,
      collection: 'Post',
      action: 'read',
      role_id: editorRole.id,
    },
    {
      id: 2,
      collection: 'Post',
      action: 'create',
      role_id: editorRole.id,
    },
    {
      id: 3,
      collection: 'Post',
      action: 'update',
      role_id: editorRole.id,
    },
    {
      id: 4,
      collection: 'Company',
      action: 'read',
      role_id: editorRole.id,
    },
    {
      id: 5,
      collection: 'Company',
      action: 'create',
      role_id: editorRole.id,
    },
    {
      id: 6,
      collection: 'Company',
      action: 'update',
      role_id: editorRole.id,
    },
  ]);

  // Collection
  Output.info('Creating collections...');
  await collectionsRepository.createMany([
    {
      id: 1,
      collection: 'Post',
      singleton: false,
      hidden: false,
      status_field: 'status',
      draft_value: '下書き',
      publish_value: '公開中',
      archive_value: '公開終了',
    },
    {
      id: 2,
      collection: 'Company',
      singleton: true,
      hidden: false,
      status_field: null,
      draft_value: null,
      publish_value: null,
      archive_value: null,
    },
  ]);

  // Field
  Output.info('Creating fields...');
  await fieldsRepository.createMany([
    // Fields related to collection Post
    {
      id: 1,
      collection: 'Post',
      field: 'id',
      label: 'id',
      special: null,
      interface: 'input',
      options: null,
      readonly: true,
      required: true,
      hidden: true,
      sort: 1,
    },
    {
      id: 2,
      collection: 'Post',
      field: 'title',
      label: 'タイトル',
      special: null,
      interface: 'input',
      options: null,
      readonly: false,
      required: false,
      hidden: false,
      sort: 2,
    },
    {
      id: 3,
      collection: 'Post',
      field: 'body',
      label: '本文',
      special: null,
      interface: 'inputMultiline',
      options: null,
      readonly: false,
      required: false,
      hidden: false,
      sort: 3,
    },
    {
      id: 4,
      collection: 'Post',
      field: 'author',
      label: '著者',
      special: null,
      interface: 'input',
      options: null,
      readonly: false,
      required: false,
      hidden: false,
      sort: 4,
    },
    {
      id: 5,
      collection: 'Post',
      field: 'status',
      label: '公開ステータス',
      special: null,
      interface: 'selectDropdownStatus',
      options:
        '{"choices":[{"label":"下書き","value":"下書き"},{"label":"公開中","value":"公開中"},{"label":"公開終了","value":"公開終了"}]}',
      readonly: false,
      required: true,
      hidden: false,
      sort: 5,
    },
    // Fields related to collection Company
    {
      id: 6,
      collection: 'Company',
      field: 'id',
      label: 'id',
      special: null,
      interface: 'input',
      options: null,
      readonly: true,
      required: true,
      hidden: true,
      sort: 1,
    },
    {
      id: 7,
      collection: 'Company',
      field: 'name',
      label: '会社名',
      special: null,
      interface: 'input',
      options: null,
      readonly: false,
      required: false,
      hidden: false,
      sort: 2,
    },
    {
      id: 8,
      collection: 'Company',
      field: 'email',
      label: 'メールアドレス',
      special: null,
      interface: 'input',
      options: null,
      readonly: false,
      required: false,
      hidden: false,
      sort: 3,
    },
    {
      id: 9,
      collection: 'Company',
      field: 'address',
      label: '住所',
      special: null,
      interface: 'input',
      options: null,
      readonly: false,
      required: false,
      hidden: false,
      sort: 4,
    },
  ]);

  // Project Setting
  Output.info('Creating project settings...');
  await projectSettingsRepository.createMany([
    {
      id: 1,
      name: 'Superfast',
    },
  ]);
};

const createCollectionTables = async (database: Knex): Promise<void> => {
  Output.info('Creating collection tables...');
  await database.schema.createTable('Post', (table) => {
    table.increments();
    table.string('title', 255);
    table.string('body', 255);
    table.string('author', 255);
    table.string('status', 255);
    table.timestamps(true, true);
  });

  await database.schema.createTable('company', (table) => {
    table.increments();
    table.string('name', 255);
    table.string('email', 255);
    table.string('address', 255);
    table.timestamps(true, true);
  });

  Output.info('Adding collection data...');
  const PostsRepository = new ContentsRepository('post');
  await PostsRepository.createMany([
    {
      id: 1,
      title: 'Superfastは、デベロッパーファーストのHeadless CMSです。',
      body: 'TypeScript、Node.js、Reactで構築された無料かつオープンソースのHeadless CMSであり、アプリケーションフレームワークです。',
      author: 'admin',
      status: '公開中',
    },
    {
      id: 2,
      title: '2023年6月〜 デモ版の提供を開始しました。',
      body: 'アドレス: https://demo.xxxx.xx',
      author: 'admin',
      status: '公開中',
    },
    {
      id: 3,
      title: '[WIP] 1.0に到達するまでのロードマップ',
      body: 'こちらの記事は書きかけです。',
      author: 'admin',
      status: '下書き',
    },
    {
      id: 4,
      title: 'α版を公開しました',
      body: '2023年3月にα版を公開しました！',
      author: 'admin',
      status: '公開終了',
    },
  ]);

  const companiesRepository = new ContentsRepository('company');
  await companiesRepository.createMany([
    {
      id: 1,
      name: 'Rocketa Inc.',
      email: 'kazane.shimizu@rocketa.co.jp',
      address: '東京都渋谷区渋谷3-1-9 YAZAWAビル3F',
    },
  ]);
};
