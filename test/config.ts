import { Knex } from 'knex';

export const allVendors = ['sqlite3'];
type Vendor = (typeof allVendors)[number];

export type Config = {
  knexConfig: Record<Vendor, Knex.Config>;
  envs: Record<Vendor, Record<string, string>>;
};

const knexConfig = {
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
  envs: {
    sqlite3: {
      DB_CLIENT: 'sqlite3',
      DB_FILENAME: './test.db',
      PORT: '40001',
    },
  },
};
