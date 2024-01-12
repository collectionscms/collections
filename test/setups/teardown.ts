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
    await dropModels(database);

    await database.destroy();
  }
}

async function dropModels(database: Knex) {
  const schemaInfo = await getSchemaInfo(database);
  const tableNames = [
    'ModelF1Constructors',
    'ModelF12023DriverStandings',
    'ModelF12022DriverStandings',
    'ModelF1CircuitStats',
    'ModelF1GrandPrixRaces',
    'ModelF1FerrariDrivers',
    'ModelF1FerrariTeamStats',
    'ModelF1GrandPrixRaceStats',
    'Categories',
    'Tags',
    'Posts',
  ];

  for (const tableName of tableNames) {
    // drop foreign key
    const columns = schemaInfo[tableName]?.columns;
    if (columns) {
      for (const [_, value] of Object.entries(columns)) {
        if (value.foreignKeyColumn) {
          await database.schema.table(tableName, function (t) {
            t.dropForeign(value.columnName);
            t.dropColumn(value.columnName);
          });
        }
      }
    }

    // drop table
    await database.schema.dropTableIfExists(tableName);
  }
}
