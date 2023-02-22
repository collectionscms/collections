import knex, { Knex } from 'knex';
import path from 'path';
import 'dotenv/config';
import camelcaseKeys from 'camelcase-keys';

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
    postProcessResponse: (result, queryContext) => {
      if (queryContext !== undefined && !queryContext['snakeToCamel']) {
        return result;
      } else {
        return camelcaseKeys(result);
      }
    },
  };

  database = knex(config);
  return database;
};
