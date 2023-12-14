import { Knex } from 'knex';
import { getHelpers } from '../helpers/index.js';
import { SchemaOverview } from '../overview.js';
import { PrimaryKey } from '../schemas.js';
import { applyTransformers } from '../transformers.js';

export type Arguments = {
  model: string;
  database: Knex;
  schema: SchemaOverview;
  data: Record<string, unknown>;
};

export const createOne = async (args: Arguments): Promise<PrimaryKey> => {
  let { database, model, schema, data } = args;
  const helpers = getHelpers(args.database);
  const overview = schema.models[model];

  if (overview) {
    await applyTransformers('create', data, overview, helpers);
  }

  const builder = database(model).insert(data);

  switch (database.client.config.client) {
    case 'sqlite3':
    case 'pg':
      builder.returning('id');
      break;
  }

  const result = await builder.then((result) => result[0]);
  const key = typeof result === 'object' ? result['id'] : result;

  // if primary key is uuid, don't use returning value
  return data['id'] ? (data['id'] as PrimaryKey) : key;
};
