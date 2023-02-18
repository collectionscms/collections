import knex, { Knex } from 'knex';
import path from 'path';
import 'dotenv/config';

let database: Knex | null = null;

export const getDatabase = async (): Promise<Knex> => {
  if (database) return database;
  let migrationFiles = path.join(__dirname, 'migrations');

  const config: Knex.Config = {
    client: process.env.DB_CLIENT,
    connection: {
      filename: process.env.DB_FILENAME,
    },
    useNullAsDefault: true,
    migrations: {
      directory: migrationFiles,
      loadExtensions: [process.env.MIGRATE_EXTENSIONS],
    },
  };

  database = knex(config);
  return database;
};
