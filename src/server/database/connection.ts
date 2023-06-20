import knex, { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../../env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let database: Knex | null = null;

export type Credentials = {
  filename?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
};

/**
 * Get a database connection.
 *
 * @param client
 * @param credentials
 * @returns
 */
export const getDatabase = (client: 'sqlite3' | 'mysql' | 'pg', credentials: Credentials): Knex => {
  if (database) return database;
  const migrationFiles = path.join(__dirname, 'migrations');
  let connection: Knex.Config['connection'] = {};

  if (client === 'sqlite3') {
    connection = {
      filename: credentials.filename || env.DB_FILENAME,
    };
  } else {
    connection = { ...credentials };
  }

  const config: Knex.Config = {
    client: client,
    connection,
    useNullAsDefault: true,
    migrations: {
      directory: migrationFiles,
      loadExtensions: [env.MIGRATE_EXTENSIONS],
    },
  };

  database = knex(config);

  return database;
};
