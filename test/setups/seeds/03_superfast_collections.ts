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
      field: 'round',
      label: 'Round',
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
    {
      collection: collectionName,
      field: 'is_shootout',
      label: 'Shootout',
      interface: 'boolean',
    },
    {
      collection: collectionName,
      field: 'created_at',
      label: 'Created At',
      interface: 'dateTime',
    },
    {
      collection: collectionName,
      field: 'updated_at',
      label: 'Updated At',
      interface: 'dateTime',
    },
  ]);

  await database.schema.createTable(collectionName, (table) => {
    table.increments();
    table.timestamps(true, true);
    table.string('year', 255);
    table.string('round', 255);
    table.string('circuit', 255);
    table.boolean('is_shootout');
  });
};
