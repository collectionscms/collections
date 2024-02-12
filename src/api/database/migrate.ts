import pkg from '@prisma/migrate';
const { Migrate } = pkg;
import { Output } from '../../utilities/output.js';

export const migrate = async (): Promise<void> => {
  try {
    const migrate = new Migrate('schema.prisma');
    migrate.applyMigrations();
    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  }
};
