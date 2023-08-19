import { Knex } from 'knex';
import { PrimaryKey } from '../schemas.js';

export type Arguments = {
  collection: string;
  database: Knex;
  key: PrimaryKey;
};

export const deleteOne = async (args: Arguments): Promise<void> => {
  let { collection, database, key } = args;

  await database(collection).where({ id: key }).del();
};
