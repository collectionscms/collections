import { Knex } from 'knex';
import { DBClient } from '../connection.js';
import { dateHelpers } from './date/index.js';

export const getHelpers = (database: Knex) => {
  const client = database.client.config.client as DBClient;

  return {
    date: new dateHelpers[client](database),
  };
};

export type Helpers = ReturnType<typeof getHelpers>;
