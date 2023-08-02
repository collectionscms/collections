import { unlinkSync } from 'fs';
import knex from 'knex';
import { JestConfigWithTsJest } from 'ts-jest/dist/types.js';
import { config } from '../config.js';
import { testDatabases } from '../utilities/testDatabases.js';

export default async function teardown(
  jestConfig?: JestConfigWithTsJest,
  _isAfterWatch = false
): Promise<void> {
  if (jestConfig?.watch || jestConfig?.watchAll) return;

  console.log('\n');
  console.log('🏁 Tests complete!\n');

  for (const testDatabase of testDatabases) {
    const knexConfig = config.knexConfig[testDatabase]!;
    const database = knex(knexConfig);

    await database.migrate.rollback(knexConfig.migrations, true);

    if (testDatabase === 'sqlite3') {
      unlinkSync('test.db');
    }

    await database.destroy();
  }
}
