import Output from '@scripts/utilities/output';
import fse from 'fs-extra';

export const writeEnvFile = async (projectDir: string, databaseName: string): Promise<void> => {
  Output.info('Create .env file.');
  const content = `DB_CLIENT="sqlite3"\nDB_FILENAME="./${databaseName}.db"\nMIGRATE_EXTENSIONS=".js"`;
  await fse.outputFile(`${projectDir}/.env`, content);
};
