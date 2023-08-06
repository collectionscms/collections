import { unlinkSync } from 'fs';
import knex, { Knex } from 'knex';
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
    await dropCollections(database.schema);

    if (testDatabase === 'sqlite3') {
      unlinkSync('test.db');
    }

    await database.destroy();
  }
}

async function dropCollections(schema: Knex.SchemaBuilder) {
  const tableNames = [
    'collection_f1_constructors',
    'collection_f1_2023_driver_standings',
    'collection_f1_2022_driver_standings',
    'collection_f1_grand_prix_races',
    'collection_f1_ferrari_team_stats',
  ];

  for (const tableName of tableNames) {
    await schema.dropTableIfExists(tableName);
  }
}
