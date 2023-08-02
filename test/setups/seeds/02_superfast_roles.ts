import { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  return await knex('superfast_roles').insert([
    { name: 'Administrator', description: 'Administrator', admin_access: true },
  ]);
};
