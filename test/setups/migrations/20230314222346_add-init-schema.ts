import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('superfast_project_settings', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('superfast_project_settings');
}
