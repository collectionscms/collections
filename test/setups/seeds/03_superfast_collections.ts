import { Knex } from 'knex';

export const seed = async (database: Knex): Promise<void> => {
  const collectionName = 'collection_f1_grand_prix_races';

  await database('superfast_collections').insert([
    {
      collection: collectionName,
      singleton: false,
      hidden: false,
    },
  ]);

  await database('superfast_fields').insert([
    {
      collection: collectionName,
      field: 'id',
      label: 'id',
      interface: 'input',
    },
    {
      collection: collectionName,
      field: 'year',
      label: 'Year',
      interface: 'input',
    },
    {
      collection: collectionName,
      field: 'circuit',
      label: 'Circuit',
      interface: 'input',
    },
  ]);

  await database.schema.createTable(collectionName, (table) => {
    table.increments();
    table.timestamps(true, true);
    table.string('year', 255);
    table.string('circuit', 255);
  });

  await database(collectionName).insert([
    {
      year: 2022,
      circuit: 'Bahrain',
    },
  ]);
};
