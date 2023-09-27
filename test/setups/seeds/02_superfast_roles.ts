import { Knex } from 'knex';
import { getHelpers } from '../../../src/api/database/helpers/index.js';

export const seed = async (database: Knex): Promise<void> => {
  const helpers = getHelpers(database);

  return await database('collections_roles').insert([
    {
      name: 'Administrator',
      description: 'Administrator',
      admin_access: true,
      created_at: helpers.date.writeTimestamp(new Date().toISOString()),
      updated_at: helpers.date.writeTimestamp(new Date().toISOString()),
    },
  ]);
};
