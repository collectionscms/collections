import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('CollectionsRoles', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 255).notNullable();
    table.string('description', 255);
    table.boolean('adminAccess').notNullable().defaultTo(0);
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable('CollectionsUsers', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 255).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
    table.boolean('isActive').notNullable().defaultTo(0);
    table.string('resetPasswordToken', 255);
    table.string('resetPasswordExpiration', 255);
    table.string('apiKey', 255);
    table.integer('roleId').unsigned().index().references('id').inTable('CollectionsRoles');
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable('CollectionsModels', (table) => {
    table.increments('id').primary().notNullable();
    table.string('model', 64).notNullable();
    table.boolean('singleton').notNullable().defaultTo(0);
    table.boolean('hidden').notNullable().defaultTo(0);
    table.string('statusField', 64);
    table.string('draftValue', 64);
    table.string('publishValue', 64);
    table.string('archiveValue', 64);
    table.string('source', 64);
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable('CollectionsPermissions', (table) => {
    table.increments('id').primary().notNullable();
    table.string('model', 255).notNullable();
    table.integer('modelId').unsigned().index().references('id').inTable('CollectionsModels');
    table.string('action', 255).notNullable();
    table.integer('roleId').unsigned().index().references('id').inTable('CollectionsRoles');
    table.timestamps(true, true, true);
    table.unique(['model', 'action', 'roleId']);
  });

  await knex.schema.createTable('CollectionsFields', (table) => {
    table.increments('id').primary().notNullable();
    table.string('model', 64).notNullable();
    table.integer('modelId').unsigned().index().references('id').inTable('CollectionsModels');
    table.string('field', 64).notNullable();
    table.string('label', 64).notNullable();
    table.string('special', 64);
    table.string('interface', 64);
    table.text('options');
    table.boolean('readonly').notNullable().defaultTo(0);
    table.boolean('required').notNullable().defaultTo(0);
    table.boolean('hidden').notNullable().defaultTo(0);
    table.integer('sort', 8);
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable('CollectionsRelations', (table) => {
    table.increments('id').primary().notNullable();
    table.string('manyModel', 64).notNullable();
    table.integer('manyModelId').unsigned().index().references('id').inTable('CollectionsModels');
    table.string('manyField', 64).notNullable();
    table.string('oneModel', 64).notNullable();
    table.integer('oneModelId').unsigned().index().references('id').inTable('CollectionsModels');
    table.string('oneField', 64).notNullable();
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable('CollectionsProjectSettings', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name', 100).notNullable();
    table.text('beforeLogin');
    table.text('afterLogin');
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable('CollectionsFiles', (table) => {
    table.increments('id').primary().notNullable();
    table.string('storage', 64).notNullable();
    table.string('fileName', 255).notNullable();
    table.string('fileNameDisk', 255).notNullable();
    table.string('type', 64).notNullable();
    table.bigInteger('fileSize');
    table.integer('width');
    table.integer('height');
    table.timestamps(true, true, true);
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table('CollectionsPermissions', (table) => {
    table.dropForeign(['roleId']);
    table.dropForeign(['modelId']);
  });

  await knex.schema.table('CollectionsFields', (table) => {
    table.dropForeign('modelId');
  });

  await knex.schema.table('CollectionsRelations', (table) => {
    table.dropForeign('manyModelId');
    table.dropForeign('oneModelId');
  });

  await knex.schema.table('CollectionsUsers', (table) => {
    table.dropForeign('roleId');
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
