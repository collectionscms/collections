import { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  await knex('superfast_project_settings').del();
  return await knex('superfast_project_settings').insert([{ name: 'superfast' }]);
};
