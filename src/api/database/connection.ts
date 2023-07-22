import knex, { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { env } from '../../env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let database: Knex | null = null;

export type DBClient = 'sqlite3' | 'mysql' | 'pg';

export type Credentials = {
  filename?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean;
};

/**
 * Get a database connection.
 *
 * @param client
 * @param credentials
 * @returns
 */
export const getDatabase = (): Knex => {
  if (database) return database;
  const migrationFiles = path.join(__dirname, 'migrations');
  const client = env.DB_CLIENT;
  let connection: Knex.Config['connection'] = {};
  let pool: Knex.Config['pool'] = {};

  if (client === 'sqlite3') {
    connection = {
      filename: env.DB_FILENAME,
    };

    pool = {
      afterCreate: async (conn: any, done: any) => {
        const run = promisify(conn.run.bind(conn));
        await run('PRAGMA foreign_keys = ON');
        done(null, conn);
      },
    };
  } else {
    connection = {
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      database: env.DB_DATABASE,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    };

    if (env.DB_SSL === 'true' && client === 'pg') {
      connection.ssl = env.DB_SSL;
    }
  }

  const config: Knex.Config = {
    client: client,
    connection,
    useNullAsDefault: true,
    migrations: {
      directory: migrationFiles,
      loadExtensions: [env.MIGRATE_EXTENSIONS],
    },
    pool,
  };

  database = knex(config);

  return database;
};
