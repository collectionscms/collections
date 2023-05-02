import { unlinkSync } from 'fs';
import { JestConfigWithTsJest } from 'ts-jest/dist/types.js';
import { vendors } from '../config.js';

export default async function teardown(
  jestConfig?: JestConfigWithTsJest,
  _isAfterWatch = false
): Promise<void> {
  if (jestConfig?.watch || jestConfig?.watchAll) return;

  console.log('\n');
  console.log('🏁 Tests complete!\n');

  vendors.map(async (vendor) => {
    if (vendor === 'sqlite3') {
      unlinkSync('test.db');
    }
  });
}
