import { Knex } from 'knex';
import { getHelpers } from '../../../src/api/database/helpers/index.js';

export const seed = async (database: Knex): Promise<void> => {
  const helpers = getHelpers(database);

  return await database('CollectionsUsers').insert([
    {
      name: 'Michael Schumacher',
      email: 'michael@collections.dev',
      password: 'password',
      isActive: true,
      apiKey: '1111-2222-3333',
      roleId: 1,
      createdAt: helpers.date.writeTimestamp(new Date().toISOString()),
      updatedAt: helpers.date.writeTimestamp(new Date().toISOString()),
    },
  ]);
};
