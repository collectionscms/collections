import { Knex } from 'knex';
import { getHelpers } from '../../../src/api/database/helpers/index.js';

export const seed = async (database: Knex): Promise<void> => {
  const helpers = getHelpers(database);

  return await database('CollectionsRoles').insert([
    {
      name: 'Administrator',
      description: 'Administrator',
      adminAccess: true,
      createdAt: helpers.date.writeTimestamp(new Date().toISOString()),
      updatedAt: helpers.date.writeTimestamp(new Date().toISOString()),
    },
  ]);
};
