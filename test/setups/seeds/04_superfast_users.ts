import { Knex } from 'knex';

export const seed = async (database: Knex): Promise<void> => {
  return await database('superfast_users').insert([
    {
      name: 'Michael Schumacher',
      email: 'michael@superfastcms.com',
      password: 'password',
      is_active: true,
      api_key: '1111-2222-3333',
      role_id: 1,
    },
  ]);
};
