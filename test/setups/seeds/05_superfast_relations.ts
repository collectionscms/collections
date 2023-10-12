import { Knex } from 'knex';

export const seed = async (database: Knex): Promise<void> => {
  const modelName = 'ModelF1CircuitStats';
  const belongingModelName = 'ModelF1GrandPrixRaces';

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
      field: 'createdAt',
      label: 'Created At',
      interface: 'dateTime',
    },
    {
      model: modelName,
      field: 'updatedAt',
      label: 'Updated At',
      interface: 'dateTime',
    },
    // one to many fields
    {
      model: belongingModelName,
      field: 'circuitStats',
      label: 'Circuit Stats',
      interface: 'listOneToMany',
    },
    {
      model: modelName,
      field: 'grandPrixRaceId',
      label: 'Grand Prix Race',
      interface: 'selectDropdownManyToOne',
    },
  ]);

  await database('CollectionsRelations').insert([
    {
      manyModel: modelName,
      manyField: 'grandPrixRaceId',
      oneModel: belongingModelName,
      oneField: 'circuitStats',
    },
  ]);

  await database.schema.createTable(modelName, (table) => {
    table.increments();
    table.timestamps(true, true, true);
    table.string('name', 255);
    table
      .integer('grandPrixRaceId')
      .unsigned()
      .index()
      .references('id')
      .inTable(belongingModelName);
  });
};
