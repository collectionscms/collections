import { Knex } from 'knex';

export const seed = async (database: Knex): Promise<void> => {
  const collectionName = 'collection_f1_circuit_stats';
  const belongingCollectionName = 'collection_f1_grand_prix_races';

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
      field: 'name',
      label: 'Name',
      interface: 'input',
    },
    // one to many fields
    {
      collection: belongingCollectionName,
      field: 'circuit_stats',
      label: 'Circuit Stats',
      interface: 'listOneToMany',
    },
    {
      collection: collectionName,
      field: 'grand_prix_race_id',
      label: 'Grand Prix Race',
      interface: 'selectDropdownManyToOne',
    },
  ]);

  await database('superfast_relations').insert([
    {
      many_collection: collectionName,
      many_field: 'grand_prix_race_id',
      one_collection: belongingCollectionName,
      one_field: 'circuit_stats',
    },
  ]);

  await database.schema.createTable(collectionName, (table) => {
    table.increments();
    table.timestamps(true, true);
    table.string('name', 255);
    table
      .integer('grand_prix_race_id')
      .unsigned()
      .index()
      .references('id')
      .inTable(belongingCollectionName);
  });
};
