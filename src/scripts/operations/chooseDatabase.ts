import inquirer from 'inquirer';
import { DBClient } from '../../api/database/connection.js';
import { Output } from '../../utilities/output.js';

const drivers: Record<DBClient, string> = {
  sqlite3: 'SQLite',
  mysql: 'MySQL / MariaDB',
  pg: 'PostgreSQL',
};

const getDriverForClient = (client: string): keyof typeof drivers | null => {
  for (const [key, value] of Object.entries(drivers)) {
    if (value === client) return key as keyof typeof drivers;
  }

  return null;
};

export const chooseDatabase = async (): Promise<DBClient> => {
  Output.info('Choose your database client. see: https://collections.dev/docs/get-started');

  const { client } = await inquirer.prompt([
    {
      type: 'list',
      name: 'client',
      message: 'Which one? SQLite is the simplest.',
      choices: Object.values(drivers),
    },
  ]);

  const driver = getDriverForClient(client);
  if (!driver) {
    throw new Error('Invalid driver');
  }

  return driver;
};
