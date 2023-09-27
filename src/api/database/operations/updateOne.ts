import { Knex } from 'knex';
import { getHelpers } from '../helpers/index.js';
import { SchemaOverview } from '../overview.js';
import { PrimaryKey } from '../schemas.js';
import { applyTransformers } from '../transformers.js';

export type Arguments = {
  model: string;
  database: Knex;
  key: PrimaryKey;
  schema: SchemaOverview;
  data: Record<string, unknown>;
};

export const updateOne = async (args: Arguments): Promise<PrimaryKey> => {
  let { database, model, key, schema, data } = args;
  const helpers = getHelpers(args.database);
  const overview = schema.models[model];

  if (overview) {
    await applyTransformers('update', data, schema.models[model], helpers);
  }

  return database(model).where({ id: key }).update(data);
};
