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

  const keys = [];

  for (const item of data) {
    const key = await createOne({ database, collection, data: item });
    keys.push(key);
  }

  return keys;
};
