import { Knex } from 'knex';
import { sleep } from './sleep.js';

/**
 * Retry a specified number of times until the database becomes available.
 * @param database
 * @param checkSql
 * @returns
 */
export const awaitDatabaseConnection = async (
  database: Knex,
  checkSql: string
): Promise<void | null> => {
  for (let attempt = 0; attempt <= 30; attempt++) {
    try {
      await database.raw(checkSql);
      return null; // success
    } catch (error) {
      await sleep(5_000);
      continue;
    }
  }
  throw new Error(`Couldn't connect to DB`);
};
