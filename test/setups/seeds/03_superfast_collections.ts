import { Knex } from 'knex';

export const seed = async (database: Knex): Promise<void> => {
  const modelName = 'ModelF1GrandPrixRaces';

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
      field: 'round',
      label: 'Round',
      interface: 'input',
    },
    {
      model: modelName,
      field: 'year',
      label: 'Year',
      interface: 'input',
    },
    {
      model: modelName,
      field: 'circuit',
      label: 'Circuit',
      interface: 'input',
    },
    {
      model: modelName,
      field: 'isShootout',
      label: 'Shootout',
      interface: 'boolean',
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
  ]);

  await database.schema.createTable(modelName, (table) => {
    table.increments();
    table.timestamps(true, true, true);
    table.string('year', 255);
    table.string('round', 255);
    table.string('circuit', 255);
    table.boolean('isShootout');
  });
};
