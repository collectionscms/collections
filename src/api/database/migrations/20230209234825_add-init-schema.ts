import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('CollectionsRoles', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 255).notNullable();
    table.string('description', 255);
    table.boolean('admin_access').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('CollectionsUsers', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 255).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
    table.boolean('is_active').notNullable().defaultTo(0);
    table.string('reset_password_token', 255);
    table.string('reset_password_expiration', 255);
    table.string('api_key', 255);
    table.integer('role_id').unsigned().index().references('id').inTable('CollectionsRoles');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('CollectionsModels', (table) => {
    table.increments('id').primary().notNullable();
    table.string('model', 64).notNullable();
    table.boolean('singleton').notNullable().defaultTo(0);
    table.boolean('hidden').notNullable().defaultTo(0);
    table.string('status_field', 64);
    table.string('draft_value', 64);
    table.string('publish_value', 64);
    table.string('archive_value', 64);
    table.string('source', 64);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('CollectionsPermissions', (table) => {
    table.increments('id').primary().notNullable();
    table.string('model', 255).notNullable();
    table.integer('model_id').unsigned().index().references('id').inTable('CollectionsModels');
    table.string('action', 255).notNullable();
    table.integer('role_id').unsigned().index().references('id').inTable('CollectionsRoles');
    table.timestamps(true, true);
    table.unique(['model', 'action', 'role_id']);
  });

  await knex.schema.createTable('CollectionsFields', (table) => {
    table.increments('id').primary().notNullable();
    table.string('model', 64).notNullable();
    table.integer('model_id').unsigned().index().references('id').inTable('CollectionsModels');
    table.string('field', 64).notNullable();
    table.string('label', 64).notNullable();
    table.string('special', 64);
    table.string('interface', 64);
    table.text('options');
    table.boolean('readonly').notNullable().defaultTo(0);
    table.boolean('required').notNullable().defaultTo(0);
    table.boolean('hidden').notNullable().defaultTo(0);
    table.integer('sort', 8);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('CollectionsRelations', (table) => {
    table.increments('id').primary().notNullable();
    table.string('many_model', 64).notNullable();
    table.integer('many_model_id').unsigned().index().references('id').inTable('CollectionsModels');
    table.string('many_field', 64).notNullable();
    table.string('one_model', 64).notNullable();
    table.integer('one_model_id').unsigned().index().references('id').inTable('CollectionsModels');
    table.string('one_field', 64).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('CollectionsProjectSettings', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 100).notNullable();
    table.text('before_login');
    table.text('after_login');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('CollectionsFiles', (table) => {
    table.increments('id').primary().notNullable();
    table.string('storage', 64).notNullable();
    table.string('file_name', 255).notNullable();
    table.string('file_name_disk', 255).notNullable();
    table.string('type', 64).notNullable();
    table.bigInteger('file_size');
    table.integer('width');
    table.integer('height');
    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table('CollectionsPermissions', (table) => {
    table.dropForeign(['role_id']);
    table.dropForeign(['model_id']);
  });

  await knex.schema.table('CollectionsFields', (table) => {
    table.dropForeign('model_id');
  });

  await knex.schema.table('CollectionsRelations', (table) => {
    table.dropForeign('many_model_id');
    table.dropForeign('one_model_id');
  });

  await knex.schema.table('CollectionsUsers', (table) => {
    table.dropForeign('role_id');
  });

  await knex.schema
    .dropTable('CollectionsRoles')
    .dropTable('CollectionsUsers')
    .dropTable('CollectionsPermissions')
    .dropTable('CollectionsModels')
    .dropTable('CollectionsFields')
    .dropTable('CollectionsRelations')
    .dropTable('CollectionsProjectSettings')
    .dropTable('CollectionsFiles');
};
