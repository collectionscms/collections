import inquirer from 'inquirer';
import { Credentials } from 'nodemailer/lib/smtp-connection';
import path from 'path';
import { DBClient } from '../../api/database/connection.js';

const filename = ({ filepath }: { filepath: string }): Record<string, string> => ({
  type: 'input',
  name: 'filename',
  message: 'Database File Path:',
  default: path.join(filepath, 'data.db'),
});

const host = (): Record<string, string> => ({
  type: 'input',
  name: 'host',
  message: 'Database Host:',
  default: '127.0.0.1',
});

const port = ({ client }: { client: string }): Record<string, any> => ({
  type: 'input',
  name: 'port',
  message: 'Port:',
  default() {
    const ports: Record<string, number> = {
      pg: 5432,
      mysql: 3306,
    };

    return ports[client];
  },
});

const database = (): Record<string, string> => ({
  type: 'input',
  name: 'database',
  message: 'Database Name:',
  default: 'collections',
});

const user = (): Record<string, string> => ({
  type: 'input',
  name: 'user',
  message: 'Database User:',
});

const password = (): Record<string, string> => ({
  type: 'password',
  name: 'password',
  message: 'Database Password:',
  mask: '*',
});

const ssl = (): Record<string, string | boolean> => ({
  type: 'confirm',
  name: 'ssl',
  message: 'Enable SSL:',
  default: false,
});

const questions = {
  sqlite3: [filename],
  mysql: [host, port, database, user, password],
  pg: [host, port, database, user, password, ssl],
};

export const makeCredentials = async (
  dbClient: DBClient,
  projectDir: string
): Promise<Credentials> => {
  const credentials: Credentials = await inquirer.prompt(
    (questions[dbClient] as any[]).map((question: ({ client, filepath }: any) => any) =>
      question({ client: dbClient, filepath: projectDir })
    )
  );

  return credentials;
};
