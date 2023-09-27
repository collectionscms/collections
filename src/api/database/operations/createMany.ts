import { Knex } from 'knex';
import { SchemaOverview } from '../overview.js';
import { PrimaryKey } from '../schemas.js';
import { createOne } from './createOne.js';

export type Arguments = {
  model: string;
  database: Knex;
  schema: SchemaOverview;
  data: Record<string, unknown>[];
};

export const createMany = async (args: Arguments): Promise<PrimaryKey[]> => {
  let { database, model, data, schema } = args;

  const keys = [];

  for (const item of data) {
    const key = await createOne({ database, model, data: item, schema });
    keys.push(key);
  }

  return keys;
};
