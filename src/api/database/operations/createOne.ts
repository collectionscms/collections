import { Knex } from 'knex';
import { PrimaryKey } from '../schemas.js';

export type Arguments = {
  collection: string;
  database: Knex;
  data: Record<string, unknown>;
};

export const createOne = async (args: Arguments): Promise<PrimaryKey> => {
  let { database, collection, data } = args;

  const builder = database(collection).insert(data);

  switch (database.client.config.client) {
    case 'sqlite3':
    case 'pg':
      builder.returning('id');
      break;
  }

  const result = await builder.then((result) => result[0]);
  const key = typeof result === 'object' ? result['id'] : result;

  return key;
};
