import { unlinkSync } from 'fs';
import { JestConfigWithTsJest } from 'ts-jest/dist/types.js';
import { testDatabases } from '../utilities/testDatabases.js';

export default async function teardown(
  jestConfig?: JestConfigWithTsJest,
  _isAfterWatch = false
): Promise<void> {
  if (jestConfig?.watch || jestConfig?.watchAll) return;

  console.log('\n');
  console.log('🏁 Tests complete!\n');

  for (const testDatabase of testDatabases) {
    if (testDatabase === 'sqlite3') {
      unlinkSync('test.db');
    }
  }
}
