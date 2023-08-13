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

  database.transaction(async (tx) => {
    for (const key of keys) {
      await deleteOne({ database: tx, collection, key: key });
    }
  });
};
