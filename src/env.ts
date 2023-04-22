import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* eslint-disable max-len */
export const defaults: Record<string, any> = {
  // /////////////////////////////////////
  // General
  // /////////////////////////////////////
  SERVER_URL: 'http://localhost:4000',
  SERVER_HOST: 'http://localhost',
  SERVER_PORT: '4000',
  ADMIN_PORT: '4001',

  // /////////////////////////////////////
  // Database
  // /////////////////////////////////////
  DB_CLIENT: 'sqlite3',
  DB_FILENAME: './data.db',
  MIGRATE_EXTENSIONS: '.ts',

  // /////////////////////////////////////
  // Express
  // /////////////////////////////////////
  REQ_LIMIT: '4mb',

  // /////////////////////////////////////
  // Argon2
  // /////////////////////////////////////

  // see: https://github.com/ranisalt/node-argon2/wiki/Options

  // The amount of memory to be used by the hash function, in KiB [65536]
  HASH_MEMORY_COST: 65536,

  // The length of the hash function output in bytes [32]
  HASH_HASH_LENGTH: 32,

  // The amount of passes (iterations) used by the hash function. It increases hash strength at the cost of time required to compute [3]
  HASH_TIME_COST: 3,

  // The amount of threads to compute the hash on. Each thread has a memory pool with HASH_MEMORY_COST size [1]
  HASH_PARALLELISM: 1,

  // The variant of the hash function (0: argon2d, 1: argon2i, or 2: argon2id) [2]
  HASH_TYPE: 2,

  // An extra and optional non-secret value. The value will be included B64 encoded in the parameters portion of the digest []
  // HASH_ASSOCIATED_DATA="foo"

  // /////////////////////////////////////
  // Session
  // /////////////////////////////////////

  // The expiresIn should be a number of seconds or string representing a timespan (60, 1d, 20h) [8h]
  ACCESS_TOKEN_TTL: '8h',
  REFRESH_TOKEN_TTL: '7d',

  // /////////////////////////////////////
  // Security
  // /////////////////////////////////////

  // Secret string for the project
  SECRET: uuidv4(),

  // /////////////////////////////////////
  // CORS
  // /////////////////////////////////////

  // see: https://github.com/expressjs/cors#configuration-options

  CORS_ENABLED: false,
  CORS_ORIGIN: false,
  CORS_METHODS: 'GET,POST,PATCH,DELETE',
  CORS_ALLOWED_HEADERS: 'Content-Type,Authorization',
  CORS_EXPOSED_HEADERS: 'Content-Range',
  CORS_CREDENTIALS: true,
  CORS_MAX_AGE: 18000,

  // /////////////////////////////////////
  // Log
  // /////////////////////////////////////

  // "fatal", "error", "warn", "info", "debug", "trace", "silent"
  LOG_LEVEL: 'info',

  // /////////////////////////////////////
  // Email
  // /////////////////////////////////////

  EMAIL_TRANSPORT: 'sendgrid',
  EMAIL_FROM: 'no-reply@example.com',
  EMAIL_SENDGRID_API_KEY: '***',
};

export let env: Record<string, any> = {
  ...defaults,
  ...process.env,
  rootDir: __dirname,
};
