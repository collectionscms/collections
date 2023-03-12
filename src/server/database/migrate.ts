import Output from '@scripts/utilities/output';
import { getDatabase } from './connection';

const migrate = async (direction: 'up' | 'down' | 'latest'): Promise<void> => {
  const database = getDatabase();

  try {
    if (direction === 'up') await database.migrate.up();
    if (direction === 'down') await database.migrate.down();
    if (direction === 'latest') await database.migrate.latest();
    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  } finally {
    database.destroy();
  }
};

export default migrate;
