import { Knex } from 'knex';
import { getHelpers } from '../../../src/api/database/helpers/index.js';

export const seed = async (database: Knex): Promise<void> => {
  const helpers = getHelpers(database);

  return await database('CollectionsProjectSettings').insert([
    {
      name: 'collections',
      beforeLogin: 'Support Hours 9:00 - 18:00',
      afterLogin: '<a href="#">Contact us</a>',
      createdAt: helpers.date.writeTimestamp(new Date().toISOString()),
      updatedAt: helpers.date.writeTimestamp(new Date().toISOString()),
    },
  ]);
};
