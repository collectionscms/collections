/* eslint-disable max-len */
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { Output } from '../../../utilities/output.js';
import { ModelsService } from '../../services/models.js';
import { ContentsService } from '../../services/contents.js';
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
    await seedingContentData(database);

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  } finally {
    database.destroy();
  }
};

const resetAll = async (database: Knex): Promise<void> => {
  await database('collections_roles').delete();
  await database('collections_users').delete();
  await database('collections_permissions').delete();
  await database('collections_models').delete();
  await database('collections_fields').delete();
  await database('collections_relations').delete();
  await database('collections_project_settings').delete();
  await database.schema.dropTableIfExists('articles');
  await database.schema.dropTableIfExists('companies');
};

const seedingSystemData = async (database: Knex): Promise<void> => {
  const schema = await getSchemaOverview({ database });

  const projectSettingsService = new ProjectSettingsService({ database, schema });
  const permissionsService = new PermissionsService({ database, schema });
  const rolesService = new RolesService({ database, schema });
  const usersService = new UsersService({ database, schema });
  const fieldsService = new FieldsService({ database, schema });
  const modelsService = new ModelsService({ database, schema });

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

  // Model: Article
  Output.info('Creating article model...');
  const articleId = await modelsService.createModel(
    {
      model: 'articles',
      singleton: false,
      hidden: false,
      status_field: null,
      draft_value: null,
      publish_value: null,
      archive_value: null,
      source: null,
    },
    true
  );

  // Fields: Article
  Output.info('Creating Article fields...');
  await fieldsService.createField({
    model: 'articles',
    model_id: articleId,
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
    model: 'articles',
    model_id: articleId,
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
    model: 'articles',
    model_id: articleId,
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

  // model: Company
  Output.info('Creating Company model...');
  const companyId = await modelsService.createModel(
    {
      model: 'companies',
      singleton: true,
      hidden: false,
      status_field: null,
      draft_value: null,
      publish_value: null,
      archive_value: null,
      source: null,
    },
    false
  );

  // Fields: Company
  Output.info('Creating Company fields...');
  await fieldsService.createField({
    model: 'companies',
    model_id: companyId,
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
    model: 'companies',
    model_id: companyId,
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
    model: 'companies',
    model_id: companyId,
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

  // Permission
  Output.info('Creating permissions...');
  await permissionsService.createMany([
    // Editor
    {
      model: 'articles',
      model_id: articleId,
      action: 'read',
      role_id: editorRole.id,
    },
    {
      model: 'articles',
      model_id: articleId,
      action: 'create',
      role_id: editorRole.id,
    },
    {
      model: 'articles',
      model_id: articleId,
      action: 'update',
      role_id: editorRole.id,
    },
    {
      model: 'companies',
      model_id: companyId,
      action: 'read',
      role_id: editorRole.id,
    },
    {
      model: 'companies',
      model_id: companyId,
      action: 'create',
      role_id: editorRole.id,
    },
    {
      model: 'companies',
      model_id: companyId,
      action: 'update',
      role_id: editorRole.id,
    },
  ]);

  // Project Setting
  Output.info('Creating project settings...');
  await projectSettingsService.createOne({
    name: 'Collections',
    before_login: '',
    after_login: '',
  });
};

const seedingContentData = async (database: Knex): Promise<void> => {
  const schema = await getSchemaOverview({ database });

  Output.info('Adding content data...');
  const articlesService = new ContentsService('articles', { database, schema });
  await articlesService.createMany([
    {
      title: 'Makes migration from legacy CMS seamless',
      body: 'Collections is open source Headless CMS built with React, Node.js, RDB. We are planning an importer to make the transition from a legacy CMS.',
      author: 'admin',
      status: 'published',
    },
    {
      title: 'June 2023- Demo version is now available',
      body: 'URL: https://demo.collections.dev/admin',
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

  const companiesService = new ContentsService('companies', { database, schema });
  await companiesService.createMany([
    {
      name: 'Rocketa Inc.',
      email: 'kazane.shimizu@rocketa.co.jp',
      address: 'YAZAWA Bldg. 3F, 3-1-9 Shibuya, Shibuya-ku, Tokyo',
    },
  ]);
};
