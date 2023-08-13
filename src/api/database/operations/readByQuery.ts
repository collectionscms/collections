import { Knex } from 'knex';

export type Arguments = {
  collection: string;
  database: Knex;
  filter?: Record<string, any>;
};

export const readByQuery = async <T>(args: Arguments): Promise<T[]> => {
  let { database, collection, filter = {} } = args;

  const results = await database(collection).where(filter).select();

  return results;
};
