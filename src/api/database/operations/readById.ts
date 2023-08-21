import { Knex } from 'knex';
import { getHelpers } from '../helpers/index.js';
import { SchemaOverview } from '../overview.js';
import { PrimaryKey } from '../schemas.js';
import { applyTransformersToFields } from '../transformers.js';

export type Arguments = {
  collection: string;
  database: Knex;
  schema: SchemaOverview;
  key: PrimaryKey;
};

export const readById = async <T>(args: Arguments): Promise<T> => {
  let { database, collection, schema, key } = args;
  const helpers = getHelpers(args.database);
  const overview = schema.collections[collection];

  const result = await database(collection)
    .where({ id: key })
    .select()
    .then((results) => results[0]);

  if (result && overview) {
    await applyTransformersToFields('read', result, overview, helpers);
  }

  return result;
};
