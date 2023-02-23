import camelcaseKeys from 'camelcase-keys';
import 'dotenv/config';
import knex, { Knex } from 'knex';
import { snakeCase } from 'lodash';
import path from 'path';

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
      // Key Type Conversion for Json Response.
      if (queryContext && !queryContext.toCamel) {
        return result;
      }
      return camelcaseKeys(result);
    },
  };

  database = knex(config);
  return database;
};
