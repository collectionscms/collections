import 'dotenv/config';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* eslint-disable max-len */
type AllowedEnvironmentVariable =
  // /////////////////////////////////////
  // General
  // /////////////////////////////////////
  | 'PUBLIC_SERVER_ORIGIN'
  | 'PUBLIC_PORTAL_SUBDOMAIN'
  | 'SERVER_HOST'
  | 'SERVER_PORT'
  | 'ADMIN_PORT'

  // /////////////////////////////////////
  // Storage
  // /////////////////////////////////////
  // "local", "aws-s3"
  | 'STORAGE_DRIVER'
  | 'STORAGE_LOCAL_ROOT'
  | 'STORAGE_KEY'
  | 'STORAGE_SECRET'
  | 'STORAGE_BUCKET'
  | 'STORAGE_REGION'

  // /////////////////////////////////////
  // Database
  // /////////////////////////////////////
  | 'DATABASE_URL'

  // /////////////////////////////////////
  // Express
  // /////////////////////////////////////
  | 'REQ_LIMIT'

  // /////////////////////////////////////
  // Hash(Argon2)
  // see: https://github.com/ranisalt/node-argon2/wiki/Options
  // /////////////////////////////////////
  // The amount of memory to be used by the hash function, in KiB [65536]
  | 'HASH_MEMORY_COST'
  // The length of the hash function output in bytes [32]
  | 'HASH_HASH_LENGTH'
  // The amount of threads to compute the hash on. Each thread has a memory pool with HASH_MEMORY_COST size [1]
  | 'HASH_PARALLELISM'
  // The amount of threads to compute the hash on. Each thread has a memory pool with HASH_MEMORY_COST size [1]
  | 'HASH_TIME_COST'
  // The variant of the hash function (0: argon2d, 1: argon2i, or 2: argon2id) [2]
  | 'HASH_TYPE'
  // An extra and optional non-secret value. The value will be included B64 encoded in the parameters portion of the digest []
  | 'HASH_ASSOCIATED_DATA'

  // /////////////////////////////////////
  // Auth
  // see: https://authjs.dev/reference/core#jwt
  // /////////////////////////////////////
  // Secret string for the project
  | 'AUTH_SECRET'
  | 'AUTH_GITHUB_ID'
  | 'AUTH_GITHUB_SECRET'
  | 'AUTH_GOOGLE_ID'
  | 'AUTH_GOOGLE_SECRET'
  | 'PUBLIC_AUTH_PROVIDERS'

  // /////////////////////////////////////
  // CORS
  // see: https://github.com/expressjs/cors#configuration-options
  // /////////////////////////////////////
  | 'CORS_ENABLED'
  | 'CORS_ORIGIN'
  | 'CORS_METHODS'
  | 'CORS_ALLOWED_HEADERS'
  | 'CORS_EXPOSED_HEADERS'
  | 'CORS_CREDENTIALS'
  | 'CORS_MAX_AGE'

  // /////////////////////////////////////
  // Log
  // /////////////////////////////////////
  // "fatal", "error", "warn", "info", "debug", "trace", "silent"
  | 'PUBLIC_LOG_LEVEL'
  | 'PUBLIC_LOG_HIDE_OBJECT'

  // /////////////////////////////////////
  // Email
  // see: https://www.twilio.com/docs/sendgrid/ui/account-and-settings/api-keys#storing-an-api-key-in-an-environment-variable
  // /////////////////////////////////////
  | 'EMAIL_TRANSPORT'
  | 'EMAIL_FROM'
  | 'EMAIL_SENDGRID_API_KEY'

  // /////////////////////////////////////
  // Editor
  // see: https://tiptap.dev/docs/guides/pro-extensions
  // /////////////////////////////////////
  | 'TIPTAP_PRO_TOKEN'

  // /////////////////////////////////////
  // System
  // /////////////////////////////////////
  | 'RESERVED_SUBDOMAINS'

  // /////////////////////////////////////
  // Collections Plugin
  // /////////////////////////////////////
  | 'TRANSLATE_API_KEY'
  | 'TEXT_GENERATOR_API_KEY'
  | 'TEXT_GENERATOR_MODEL';

export const defaults: Partial<Record<AllowedEnvironmentVariable, any>> = {
  // General
  PUBLIC_SERVER_ORIGIN: 'http://app.test.com:4000',
  PUBLIC_PORTAL_SUBDOMAIN: 'app',
  SERVER_HOST: 'test.com',
  SERVER_PORT: '4000',
  ADMIN_PORT: '4001',

  // Storage
  STORAGE_DRIVER: 'local',
  STORAGE_LOCAL_ROOT: 'uploads',

  // Express
  REQ_LIMIT: '4mb',

  // Hash(Argon2)
  HASH_MEMORY_COST: 65536,
  HASH_HASH_LENGTH: 32,
  HASH_TIME_COST: 3,
  HASH_PARALLELISM: 1,
  HASH_TYPE: 2,

  // Auth
  PUBLIC_AUTH_PROVIDERS: 'email,google,github',

  // CORS
  CORS_ENABLED: false,
  CORS_ORIGIN: false,
  CORS_METHODS: 'GET,POST,PATCH,DELETE',
  CORS_ALLOWED_HEADERS: 'Content-Type,Authorization',
  CORS_EXPOSED_HEADERS: 'Content-Range',
  CORS_CREDENTIALS: true,
  CORS_MAX_AGE: 18000,

  // Log
  PUBLIC_LOG_LEVEL: 'info',
  PUBLIC_LOG_HIDE_OBJECT: true,

  // Email
  EMAIL_TRANSPORT: 'sendgrid',

  // System
  RESERVED_SUBDOMAINS: 'app',
};

export let env: Record<string, any> = {
  ...defaults,
  ...process.env,
  ROOT_DIR: __dirname,
};

export const publicEnv = Object.entries(env).reduce((values, [key, val]) => {
  if (key.indexOf('PUBLIC_') === 0) {
    return {
      ...values,
      [key]: `${val}`,
    };
  }

  return values;
}, {});
