import { Knex } from 'knex';
import { getHelpers } from '../helpers/index.js';
import { SchemaOverview } from '../overview.js';
import { PrimaryKey } from '../schemas.js';
import { applyTransformers } from '../transformers.js';

export type Arguments = {
  model: string;
  database: Knex;
  schema: SchemaOverview;
  key: PrimaryKey;
};

export const readById = async <T>(args: Arguments): Promise<T> => {
  let { database, model, schema, key } = args;
  const helpers = getHelpers(args.database);
  const overview = schema.models[model];

  const result = await database(model)
    .where({ id: key })
    .select()
    .then((results) => results[0]);

  if (result && overview) {
    await applyTransformers('read', result, overview, helpers);
  }

  return result;
};
