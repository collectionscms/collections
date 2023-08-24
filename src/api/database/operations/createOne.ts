import { Knex } from 'knex';
import { getHelpers } from '../helpers/index.js';
import { SchemaOverview } from '../overview.js';
import { PrimaryKey } from '../schemas.js';
import { applyTransformers } from '../transformers.js';

export type Arguments = {
  collection: string;
  database: Knex;
  schema: SchemaOverview;
  data: Record<string, unknown>;
};

export const createOne = async (args: Arguments): Promise<PrimaryKey> => {
  let { database, collection, schema, data } = args;
  const helpers = getHelpers(args.database);
  const overview = schema.collections[collection];

  if (overview) {
    await applyTransformers('create', data, overview, helpers);
  }

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
