import knex, { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  await knex('superfast_project_settings').del();
  await knex('superfast_users').del();
  await knex('superfast_roles').del();
  await knex('superfast_collections').delete();
  await knex('superfast_fields').delete();
  await knex.schema.dropTableIfExists('collection_formula_one_constructors');
};
