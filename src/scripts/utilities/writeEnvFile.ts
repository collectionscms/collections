import fse from 'fs-extra';
import { defaults } from '../../env';
import Output from './output';

export const writeEnvFile = async (projectDir: string, databaseName: string): Promise<void> => {
  Output.info('Create .env file.');

  let configs: string = '';

  for (let [key, value] of Object.entries(defaults)) {
    if (key === 'DB_FILENAME') {
      value = `./${databaseName}.db`;
    }

    if (key === 'MIGRATE_EXTENSIONS') {
      value = '.js';
    }

    switch (typeof value) {
      case 'string':
        configs += `${key}="${value}"\n`;
        break;
      default:
        configs += `${key}=${value}\n`;
    }
  }

  await fse.outputFile(`${projectDir}/.env`, configs);
};
