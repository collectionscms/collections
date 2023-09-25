import { Knex } from 'knex';
import { PrimaryKey } from '../schemas.js';
import { deleteOne } from './deleteOne.js';

export type Arguments = {
  model: string;
  database: Knex;
  keys: PrimaryKey[];
};

export const deleteMany = async (args: Arguments): Promise<void> => {
  let { model, database, keys } = args;

  for (const key of keys) {
    await deleteOne({ database, model, key: key });
  }
};
