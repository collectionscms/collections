import { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  await knex('superfast_collections').insert([
    {
      collection: 'collection_formula_one_constructors',
      singleton: false,
      hidden: false,
    },
  ]);

  await knex.schema.createTable('collection_formula_one_constructors', (table) => {
    table.increments();
    table.timestamps(true, true);
  });
};
