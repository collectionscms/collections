import { unlinkSync } from 'fs';
import knex, { Knex } from 'knex';
import { JestConfigWithTsJest } from 'ts-jest/dist/types.js';
import { getSchemaInfo } from '../../src/api/database/inspector.js';
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
    await dropCollections(database);

    if (testDatabase === 'sqlite3') {
      unlinkSync('test.db');
    }

    await database.destroy();
  }
}

async function dropCollections(database: Knex) {
  const schemaInfo = await getSchemaInfo(database);
  const tableNames = [
    'collection_f1_constructors',
    'collection_f1_2023_driver_standings',
    'collection_f1_2022_driver_standings',
    'collection_f1_circuit_stats',
    'collection_f1_grand_prix_races',
    'collection_f1_ferrari_team_stats',
    'collection_f1_grand_prix_race_stats',
    'category',
    'tag',
    'post',
  ];

  for (const tableName of tableNames) {
    // drop foreign key
    const columns = schemaInfo[tableName]?.columns;
    if (columns) {
      for (const [_, value] of Object.entries(columns)) {
        if (value.foreign_key_column) {
          await database.schema.table(tableName, function (t) {
            t.dropForeign(value.column_name);
            t.dropColumn(value.column_name);
          });
        }
      }
    }

    // drop table
    await database.schema.dropTableIfExists(tableName);
  }
}
