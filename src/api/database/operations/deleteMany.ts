import { Knex } from 'knex';
import { PrimaryKey } from '../schemas.js';
import { deleteOne } from './deleteOne.js';

export type Arguments = {
  collection: string;
  database: Knex;
  keys: PrimaryKey[];
};

export const deleteMany = async (args: Arguments): Promise<void> => {
  let { collection, database, keys } = args;

  for (const key of keys) {
    await deleteOne({ database, collection, key: key });
  }
};
