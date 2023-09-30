import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('collections_roles', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 255).notNullable();
    table.string('description', 255);
    table.boolean('admin_access').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('collections_users', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 255).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
    table.boolean('is_active').notNullable().defaultTo(0);
    table.string('reset_password_token', 255);
    table.string('reset_password_expiration', 255);
    table.string('api_key', 255);
    table.integer('role_id').unsigned().index().references('id').inTable('collections_roles');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('collections_models', (table) => {
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

  await knex.schema.createTable('collections_permissions', (table) => {
    table.increments('id').primary().notNullable();
    table.string('model', 255).notNullable();
    table.integer('model_id').unsigned().index().references('id').inTable('collections_models');
    table.string('action', 255).notNullable();
    table.integer('role_id').unsigned().index().references('id').inTable('collections_roles');
    table.timestamps(true, true);
    table.unique(['model', 'action', 'role_id']);
  });

  await knex.schema.createTable('collections_fields', (table) => {
    table.increments('id').primary().notNullable();
    table.string('model', 64).notNullable();
    table.integer('model_id').unsigned().index().references('id').inTable('collections_models');
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

  await knex.schema.createTable('collections_relations', (table) => {
    table.increments('id').primary().notNullable();
    table.string('many_model', 64).notNullable();
    table
      .integer('many_model_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('collections_models');
    table.string('many_field', 64).notNullable();
    table.string('one_model', 64).notNullable();
    table.integer('one_model_id').unsigned().index().references('id').inTable('collections_models');
    table.string('one_field', 64).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('collections_project_settings', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 100).notNullable();
    table.text('before_login');
    table.text('after_login');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('collections_files', (table) => {
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
  await knex.schema.table('collections_permissions', (table) => {
    table.dropForeign(['role_id']);
    table.dropForeign(['model_id']);
  });

  await knex.schema.table('collections_fields', (table) => {
    table.dropForeign('model_id');
  });

  await knex.schema.table('collections_relations', (table) => {
    table.dropForeign('many_model_id');
    table.dropForeign('one_model_id');
  });

  await knex.schema.table('collections_users', (table) => {
    table.dropForeign('role_id');
  });

  await knex.schema
    .dropTable('collections_roles')
    .dropTable('collections_users')
    .dropTable('collections_permissions')
    .dropTable('collections_models')
    .dropTable('collections_fields')
    .dropTable('collections_relations')
    .dropTable('collections_project_settings')
    .dropTable('collections_files');
};
