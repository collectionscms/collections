import { Knex } from 'knex';
import { getSchemaInfo } from '../inspector.js';
import { PrimaryKey } from '../schemas.js';

export type Arguments = {
  collection: string;
  database: Knex;
  key: PrimaryKey;
  data: Record<string, unknown>;
};

export const updateOne = async (args: Arguments): Promise<PrimaryKey> => {
  let { database, collection, key, data } = args;

  const schemaInfo = await getSchemaInfo(database);

  if (schemaInfo[args.collection].columns.updated_at) {
    data = { ...data, updated_at: database.fn.now() };
  }

  return database(collection).where({ id: key }).update(data);
};
