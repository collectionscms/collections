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
    mysql: {
      client: 'mysql',
      connection: {
        database: 'superfast',
        user: 'root',
        password: 'password',
        host: 'localhost',
        port: 30100,
      },
      ...knexConfig,
    },
    maria: {
      client: 'mysql',
      connection: {
        database: 'superfast',
        user: 'root',
        password: 'password',
        host: 'localhost',
        port: 30101,
      },
      ...knexConfig,
    },
    postgres: {
      client: 'pg',
      connection: {
        database: 'superfast',
        user: 'postgres',
        password: 'password',
        host: 'localhost',
        port: 30200,
      },
      ...knexConfig,
    },
  },
};
