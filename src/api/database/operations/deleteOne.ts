import { Knex } from 'knex';
import { PrimaryKey } from '../schemas.js';

export type Arguments = {
  model: string;
  database: Knex;
  key: PrimaryKey;
};

export const deleteOne = async (args: Arguments): Promise<void> => {
  let { model, database, key } = args;

  await database(model).where({ id: key }).del();
};
