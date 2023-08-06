import { Knex } from 'knex';

export const seed = async (database: Knex): Promise<void> => {
  return await database('superfast_roles').insert([
    { name: 'Administrator', description: 'Administrator', admin_access: true },
  ]);
};
