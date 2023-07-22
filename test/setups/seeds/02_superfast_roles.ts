import { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  return await knex('superfast_roles').insert([
    { id: 1, name: 'Administrator', description: 'Administrator', admin_access: true },
  ]);
};
