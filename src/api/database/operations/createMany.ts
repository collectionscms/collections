import { Knex } from 'knex';
import { PrimaryKey } from '../schemas.js';
import { createOne } from './createOne.js';

export type Arguments = {
  collection: string;
  database: Knex;
  data: Record<string, unknown>[];
};

export const createMany = async (args: Arguments): Promise<PrimaryKey[]> => {
  let { database, collection, data } = args;

  const keys = database.transaction(async (tx) => {
    const keys = [];

    for (const item of data) {
      const key = await createOne({ database: tx, collection, data: item });
      keys.push(key);
    }

    return keys;
  });

  return keys;
};
