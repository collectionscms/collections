import { Knex } from 'knex';

export const seed = async (database: Knex): Promise<void> => {
  const modelName = 'model_f1_grand_prix_races';

  await database('superfast_models').insert([
    {
      model: modelName,
      singleton: false,
      hidden: false,
    },
  ]);

  await database('superfast_fields').insert([
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
      field: 'is_shootout',
      label: 'Shootout',
      interface: 'boolean',
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
  ]);

  await database.schema.createTable(modelName, (table) => {
    table.increments();
    table.timestamps(true, true);
    table.string('year', 255);
    table.string('round', 255);
    table.string('circuit', 255);
    table.boolean('is_shootout');
  });
};
