import { Knex } from 'knex';
import { getHelpers } from '../../../src/api/database/helpers/index.js';

export const seed = async (database: Knex): Promise<void> => {
  const helpers = getHelpers(database);

  return await database('superfast_project_settings').insert([
    {
      name: 'superfast',
      before_login: 'Support Hours 9:00 - 18:00',
      after_login: '<a href="#">Contact us</a>',
      created_at: helpers.date.writeTimestamp(new Date().toISOString()),
      updated_at: helpers.date.writeTimestamp(new Date().toISOString()),
    },
  ]);
};
