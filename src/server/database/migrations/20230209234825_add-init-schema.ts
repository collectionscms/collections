import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('superfast_roles', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 255).notNullable();
    table.string('description', 255);
    table.boolean('admin_access').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('superfast_users', (table) => {
    table.increments('id').primary().notNullable();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('user_name', 255).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
    table.boolean('is_active').notNullable().defaultTo(0);
    table.string('token', 255);
    table
      .integer('superfast_role_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('superfast_roles');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('superfast_permissions', (table) => {
    table.increments('id').primary().notNullable();
    table.string('collection', 255).notNullable();
    table.string('action', 255).notNullable();
    table
      .integer('superfast_role_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('superfast_roles');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('superfast_collections', (table) => {
    table.increments('id').primary().notNullable();
    table.string('collection', 64).notNullable();
    table.boolean('singleton').notNullable().defaultTo(0);
    table.boolean('hidden').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('superfast_fields', (table) => {
    table.increments('id').primary().notNullable();
    table.string('field', 64).notNullable();
    table.string('label', 64).notNullable();
    table.string('special', 64);
    table.string('interface', 64);
    table.boolean('readonly').notNullable().defaultTo(0);
    table.boolean('required').notNullable().defaultTo(0);
    table.boolean('hidden').notNullable().defaultTo(0);
    table.integer('sort', 8);
    table
      .integer('superfast_collection_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('superfast_collections');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('superfast_field_options', (table) => {
    table.increments('id').primary().notNullable();
    table.string('key', 64).notNullable();
    table.string('value', 64).notNullable();
    table
      .integer('superfast_field_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('superfast_fields');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('superfast_relations', (table) => {
    table.increments('id').primary().notNullable();
    table.string('many_collection', 64).notNullable();
    table.string('many_field', 64).notNullable();
    table.string('one_collection', 64).notNullable();
    table.string('one_field', 64);
    table.string('one_collection_field', 64);
    table.text('one_allowed_collections');
    table.string('junction_field', 64);
    table.string('sort_field', 64);
    table.string('one_deselect_action', 255);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('superfast_project_settings', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 100).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable('superfast_roles')
    .dropTable('superfast_users')
    .dropTable('superfast_permissions')
    .dropTable('superfast_collections')
    .dropTable('superfast_fields')
    .dropTable('superfast_field_options')
    .dropTable('superfast_relations')
    .dropTable('superfast_project_settings');
}
