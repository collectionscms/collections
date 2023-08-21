import { Knex } from 'knex';
import { getHelpers } from '../helpers/index.js';
import { SchemaOverview } from '../overview.js';
import { PrimaryKey } from '../schemas.js';
import { applyTransformersToFields } from '../transformers.js';

export type Arguments = {
  collection: string;
  database: Knex;
  key: PrimaryKey;
  schema: SchemaOverview;
  data: Record<string, unknown>;
};

export const updateOne = async (args: Arguments): Promise<PrimaryKey> => {
  let { database, collection, key, schema, data } = args;
  const helpers = getHelpers(args.database);
  const overview = schema.collections[collection];

  if (overview) {
    await applyTransformersToFields('update', data, schema.collections[collection], helpers);
  }

  return database(collection).where({ id: key }).update(data);
};
