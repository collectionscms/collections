import inquirer from 'inquirer';
import { DBClient } from '../../api/database/connection.js';
import { Output } from '../../utilities/output.js';

const drivers: Record<DBClient, string> = {
  mysql: 'MySQL / MariaDB',
  pg: 'PostgreSQL',
  sqlite3: 'SQLite',
};

const getDriverForClient = (client: string): keyof typeof drivers | null => {
  for (const [key, value] of Object.entries(drivers)) {
    if (value === client) return key as keyof typeof drivers;
  }

  return null;
};

export const chooseDatabase = async (): Promise<DBClient> => {
  Output.info('Choose your database client');

  const { client } = await inquirer.prompt([
    {
      type: 'list',
      name: 'client',
      message: 'Choose your database client',
      choices: Object.values(drivers),
    },
  ]);

  const driver = getDriverForClient(client);
  if (!driver) {
    throw new Error('Invalid driver');
  }

  return driver;
};
