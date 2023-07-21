import { Knex } from 'knex';
import { allDatabases } from './utilities/testDatabases.js';

type Database = (typeof allDatabases)[number];

export type Config = {
  knexConfig: Record<Database, Knex.Config & { waitTestSql: string }>;
};

const knexConfig = {
  waitTestSql: 'SELECT 1',
  migrations: {
    directory: './test/setups/migrations',
  },
  seeds: {
    directory: './test/setups/seeds',
  },
};

export const config: Config = {
  knexConfig: {
    sqlite3: {
      client: 'sqlite3',
      connection: {
        filename: './test.db',
      },
      useNullAsDefault: true,
      ...knexConfig,
    },
  },
};
