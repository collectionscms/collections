import camelcaseKeys from 'camelcase-keys';
import { snakeCase } from 'change-case';
import knex, { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../../env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let database: Knex | null = null;

export const getDatabase = (): Knex => {
  if (database) return database;
  const migrationFiles = path.join(__dirname, 'migrations');

  const config: Knex.Config = {
    client: env.DB_CLIENT,
    connection: {
      filename: env.DB_FILENAME,
    },
    useNullAsDefault: true,
    migrations: {
      directory: migrationFiles,
      loadExtensions: [env.MIGRATE_EXTENSIONS],
    },
    wrapIdentifier(value, wrapIdentifier) {
      // Convert field to snake case.
      const snakedValue = snakeCase(value) || value;
      return wrapIdentifier(snakedValue);
    },
    postProcessResponse: (result) => {
      // Convert field to camel case.
      return camelcaseKeys(result);
    },
  };

  database = knex(config);

  return database;
};
