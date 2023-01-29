import Output from '@scripts/utilities/output';
import fse from 'fs-extra';

export const writeEnvFile = async (projectDir: string, databaseName: string): Promise<void> => {
  Output.info('Create .env file.');
  const content = `DATABASE_URL="file:./${databaseName}.db"`;
  await fse.outputFile(`${projectDir}/.env`, content);
};
