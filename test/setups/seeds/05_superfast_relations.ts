import { Knex } from 'knex';

export const seed = async (database: Knex): Promise<void> => {
  const modelName = 'model_f1_circuit_stats';
  const belongingModelName = 'model_f1_grand_prix_races';

  await database('CollectionsModels').insert([
    {
      model: modelName,
      singleton: false,
      hidden: false,
    },
  ]);

  await database('CollectionsFields').insert([
    {
      model: modelName,
      field: 'id',
      label: 'id',
      interface: 'input',
    },
    {
      model: modelName,
      field: 'name',
      label: 'Name',
      interface: 'input',
    },
    {
      model: modelName,
      field: 'created_at',
      label: 'Created At',
      interface: 'dateTime',
    },
    {
      model: modelName,
      field: 'updated_at',
      label: 'Updated At',
      interface: 'dateTime',
    },
    // one to many fields
    {
      model: belongingModelName,
      field: 'circuit_stats',
      label: 'Circuit Stats',
      interface: 'listOneToMany',
    },
    {
      model: modelName,
      field: 'grand_prix_race_id',
      label: 'Grand Prix Race',
      interface: 'selectDropdownManyToOne',
    },
  ]);

  await database('CollectionsRelations').insert([
    {
      many_model: modelName,
      many_field: 'grand_prix_race_id',
      one_model: belongingModelName,
      one_field: 'circuit_stats',
    },
  ]);

  await database.schema.createTable(modelName, (table) => {
    table.increments();
    table.timestamps(true, true);
    table.string('name', 255);
    table
      .integer('grand_prix_race_id')
      .unsigned()
      .index()
      .references('id')
      .inTable(belongingModelName);
  });
};
