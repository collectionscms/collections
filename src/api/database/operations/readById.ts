import { Knex } from 'knex';
import { PrimaryKey } from '../schemas.js';

export type Arguments = {
  collection: string;
  database: Knex;
  key: PrimaryKey;
};

export const readById = async <T>(args: Arguments): Promise<T> => {
  let { database, collection, key } = args;

  const result = await database(collection)
    .where({ id: key })
    .select()
    .then((results) => results[0] as T);

  return result;
};
