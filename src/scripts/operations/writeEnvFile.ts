import fse from 'fs-extra';
import { defaults } from '../../env.js';
import { Credentials, DBClient } from '../../server/database/connection.js';
import { Output } from '../../utilities/output.js';

export const writeEnvFile = async (
  projectDir: string,
  dbClient: DBClient,
  credentials: Credentials
): Promise<void> => {
  Output.info('Create .env file.');

  const variables: Record<string, any> = { ...defaults, DB_CLIENT: dbClient };

  for (const [key, value] of Object.entries(credentials)) {
    variables[`DB_${key.toUpperCase()}`] = value;
  }

  let stringVars: string = '';

  for (let [key, value] of Object.entries(variables)) {
    if (key === 'MIGRATE_EXTENSIONS') {
      value = '.js';
    }

    switch (typeof value) {
      case 'string':
        stringVars += `${key}="${value}"\n`;
        break;
      default:
        stringVars += `${key}=${value}\n`;
    }
  }

  await fse.outputFile(`${projectDir}/.env`, stringVars);
};
