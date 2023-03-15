import { writeFileSync } from 'fs';
import knex from 'knex';
import config, { vendors } from '../config';

let started = false;

export default async (): Promise<void> => {
  if (started) return;
  started = true;

  console.log('\n\n');
  console.log('🟢 Starting tests! \n');

  vendors.map(async (vendor) => {
    const database = knex(config.knexConfig[vendor]!);
    if (vendor === 'sqlite3') {
      writeFileSync('test.db', '');
    }

    await database.migrate.latest();
    await database.seed.run();
    await database.destroy();
  });
};
