/* eslint-disable max-len */
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { Output } from '../../../utilities/output.js';
import { CollectionsRepository } from '../../repositories/collections.js';
import { ContentsRepository } from '../../repositories/contents.js';
import { FieldsRepository } from '../../repositories/fields.js';
import { CollectionsService } from '../../services/collections.js';
import { FieldsService } from '../../services/fields.js';
import { PermissionsService } from '../../services/permissions.js';
import { ProjectSettingsService } from '../../services/projectSettings.js';
import { RolesService } from '../../services/roles.js';
import { UsersService } from '../../services/users.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { getDatabase } from '../connection.js';
import { getSchemaOverview } from '../overview.js';

export const seedDev = async (): Promise<void> => {
  const database = getDatabase();

  try {
    await resetAll(database);
    await seedingSystemData(database);
    await seedingCollectionData();

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
  await database.schema.dropTableIfExists('Post');
  await database.schema.dropTableIfExists('Company');
};

const seedingSystemData = async (database: Knex): Promise<void> => {
  const schema = await getSchemaOverview({ database });

  const collectionsRepository = new CollectionsRepository();
  const fieldsRepository = new FieldsRepository();

  const collectionsService = new CollectionsService(collectionsRepository, fieldsRepository);
  const fieldsService = new FieldsService(fieldsRepository);

  const projectSettingsService = new ProjectSettingsService({ database, schema });
  const permissionsService = new PermissionsService({ database, schema });
  const rolesService = new RolesService({ database, schema });
  const usersService = new UsersService({ database, schema });

  // Role
  Output.info('Creating roles...');
  await rolesService.createMany([
    { name: 'Administrator', description: 'Administrator', admin_access: true },
    { name: 'Editor', description: 'Editor', admin_access: false },
  ] as any[]);

  // User
  Output.info('Creating users...');
  const adminRole = await rolesService.readOne(1);
  const editorRole = await rolesService.readOne(2);
  const password = await oneWayHash('password');

  await usersService.createMany([
    {
      name: 'admin',
      email: 'admin@example.com',
      password,
      is_active: true,
      role_id: adminRole.id,
    },
    {
      name: 'editor',
      email: 'editor@example.com',
      password,
      is_active: false,
      api_key: uuidv4(),
      role_id: editorRole.id,
    },
  ] as any[]);

  // Permission
  Output.info('Creating permissions...');
  await permissionsService.createMany([
    // Editor
    {
      collection: 'Post',
      action: 'read',
      role_id: editorRole.id,
    },
    {
      collection: 'Post',
      action: 'create',
      role_id: editorRole.id,
    },
    {
      collection: 'Post',
      action: 'update',
      role_id: editorRole.id,
    },
    {
      collection: 'Company',
      action: 'read',
      role_id: editorRole.id,
    },
    {
      collection: 'Company',
      action: 'create',
      role_id: editorRole.id,
    },
    {
      collection: 'Company',
      action: 'update',
      role_id: editorRole.id,
    },
  ]);

  // Collection: Post
  Output.info('Creating Post collection...');
  await collectionsService.createCollection({
    collection: 'Post',
    singleton: false,
    hidden: false,
    status: true,
    status_field: null,
    draft_value: null,
    publish_value: null,
    archive_value: null,
  });

  // Fields: Post
  Output.info('Creating Post fields...');
  await fieldsService.createField({
    collection: 'Post',
    field: 'title',
    label: 'Title',
    special: null,
    interface: 'input',
    options: null,
    readonly: false,
    required: false,
    hidden: false,
    sort: 1,
  });

  await fieldsService.createField({
    collection: 'Post',
    field: 'body',
    label: 'Body',
    special: null,
    interface: 'inputMultiline',
    options: null,
    readonly: false,
    required: false,
    hidden: false,
    sort: 2,
  });

  await fieldsService.createField({
    collection: 'Post',
    field: 'author',
    label: 'Author',
    special: null,
    interface: 'input',
    options: null,
    readonly: false,
    required: false,
    hidden: false,
    sort: 3,
  });

  // Collection: Company
  Output.info('Creating Company collection...');
  await collectionsService.createCollection({
    collection: 'Company',
    singleton: true,
    hidden: false,
    status: false,
    status_field: null,
    draft_value: null,
    publish_value: null,
    archive_value: null,
  });

  // Fields: Company
  Output.info('Creating Company fields...');
  await fieldsService.createField({
    collection: 'Company',
    field: 'name',
    label: 'Company Name',
    special: null,
    interface: 'input',
    options: null,
    readonly: false,
    required: false,
    hidden: false,
    sort: 1,
  });

  await fieldsService.createField({
    collection: 'Company',
    field: 'email',
    label: 'Mail Address',
    special: null,
    interface: 'input',
    options: null,
    readonly: false,
    required: false,
    hidden: false,
    sort: 2,
  });

  await fieldsService.createField({
    collection: 'Company',
    field: 'address',
    label: 'Address',
    special: null,
    interface: 'input',
    options: null,
    readonly: false,
    required: false,
    hidden: false,
    sort: 3,
  });

  // Project Setting
  Output.info('Creating project settings...');
  await projectSettingsService.createOne({
    name: 'Superfast',
    before_login: '',
    after_login: '',
  });
};

const seedingCollectionData = async (): Promise<void> => {
  Output.info('Adding collection data...');
  const postsRepository = new ContentsRepository('Post');
  await postsRepository.createMany([
    {
      title: 'Makes migration from legacy CMS seamless',
      body: 'Superfast is open source Headless CMS built with React, Node.js, RDB. We are planning an importer to make the transition from a legacy CMS.',
      author: 'admin',
      status: 'published',
    },
    {
      title: 'June 2023- Demo version is now available',
      body: 'URL: https://demo.superfastcms.com/admin',
      author: 'admin',
      status: 'published',
    },
    {
      title: '[WIP] Road map to reach 1.0',
      body: 'in progress...',
      author: 'admin',
      status: 'draft',
    },
    {
      title: 'Alpha version is now available!',
      body: 'Alpha version was released in March 2023.',
      author: 'admin',
      status: 'archived',
    },
    {
      title: 'Beta version is now available!!',
      body: 'Beta version was released in August 2023.',
      author: 'admin',
      status: 'published',
    },
  ]);

  const companiesRepository = new ContentsRepository('Company');
  await companiesRepository.createMany([
    {
      name: 'Rocketa Inc.',
      email: 'kazane.shimizu@rocketa.co.jp',
      address: 'YAZAWA Bldg. 3F, 3-1-9 Shibuya, Shibuya-ku, Tokyo',
    },
  ]);
};
