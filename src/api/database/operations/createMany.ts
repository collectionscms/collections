import { Knex } from 'knex';
import { SchemaOverview } from '../overview.js';
import { PrimaryKey } from '../schemas.js';
import { createOne } from './createOne.js';

export type Arguments = {
  collection: string;
  database: Knex;
  schema: SchemaOverview;
  data: Record<string, unknown>[];
};

export const createMany = async (args: Arguments): Promise<PrimaryKey[]> => {
  let { database, collection, data, schema } = args;

  const keys = [];

  for (const item of data) {
    const key = await createOne({ database, collection, data: item, schema });
    keys.push(key);
  }

  return keys;
};
