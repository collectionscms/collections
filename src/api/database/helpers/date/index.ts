import { DBClient } from '../../connection.js';
import { DateHelperDefault } from './dialects/default.js';
import { DateHelperMySQL } from './dialects/mysql.js';

export type DateHelpers = typeof DateHelperMySQL | typeof DateHelperDefault;

export const dateHelpers: Record<DBClient, DateHelpers> = {
  sqlite3: DateHelperDefault,
  pg: DateHelperDefault,
  mysql: DateHelperMySQL,
};
