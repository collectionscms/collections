import { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { allDatabases } from './utilities/testDatabases.js';

type Database = (typeof allDatabases)[number];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationFiles = path.join(__dirname, '../src/api/database/migrations');

export type Config = {
  knexConfig: Record<Database, Knex.Config & { waitTestSql: string }>;
};

const knexConfig = {
  waitTestSql: 'SELECT 1',
  migrations: {
    directory: migrationFiles,
  },
  seeds: {
    directory: './test/setups/seeds',
  },
};

export const config: Config = {
  knexConfig: {
    postgres: {
      client: 'pg',
      connection: {
        database: 'collections',
        user: 'postgres',
        password: 'password',
        host: 'localhost',
        port: 30200,
      },
      ...knexConfig,
    },
  },
};
