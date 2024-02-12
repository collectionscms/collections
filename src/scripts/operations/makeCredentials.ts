import inquirer from 'inquirer';

export type Credentials = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
};

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

const questions = [host, port, database, user, password, ssl];

export const makeCredentials = async (projectDir: string): Promise<Credentials> => {
  const credentials: Credentials = await inquirer.prompt(
    questions.map((question: ({ client, filepath }: any) => any) =>
      question({ client: 'pg', filepath: projectDir })
    )
  );

  return credentials;
};
