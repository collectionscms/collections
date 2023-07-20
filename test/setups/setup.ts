import { writeFileSync } from 'fs';
import knex from 'knex';
import { config } from '../config.js';
import { testDatabases } from '../utilities/testDatabases.js';

let started = false;

export default async (): Promise<void> => {
  if (started) return;
  started = true;

  for (const testDatabase of testDatabases) {
    const database = knex(config.knexConfig[testDatabase]!);
    if (testDatabase === 'sqlite3') {
      writeFileSync('test.db', '');
    }

    await database.migrate.latest();
    await database.seed.run();
    await database.destroy();
  }

  console.log('\n\n');
  console.log('Setup databases:', testDatabases);
  console.log('🟢 Starting tests! \n');
};
