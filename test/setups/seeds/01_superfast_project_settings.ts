import { Knex } from 'knex';

export const seed = async (database: Knex): Promise<void> => {
  return await database('superfast_project_settings').insert([
    {
      name: 'superfast',
      before_login: 'Support Hours 9:00 - 18:00',
      after_login: '<a href="#">Contact us</a>',
    },
  ]);
};
