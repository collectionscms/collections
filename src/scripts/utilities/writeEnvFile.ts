import fse from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import Output from '../../scripts/utilities/output';

export const writeEnvFile = async (projectDir: string, databaseName: string): Promise<void> => {
  Output.info('Create .env file.');
  const database = `DB_CLIENT="sqlite3"\nDB_FILENAME="./${databaseName}.db"\nMIGRATE_EXTENSIONS=".js"`;
  const argon2 = `HASH_MEMORY_COST=4096\nHASH_HASH_LENGTH=32\nHASH_TIME_COST=3\nHASH_PARALLELISM=1\nHASH_TYPE=2\n# HASH_ASSOCIATED_DATA="foo"`;
  const session = `ACCESS_TOKEN_TTL="8h"\nREFRESH_TOKEN_TTL="7d"`;
  const security = `SECRET="${uuidv4()}"`;

  await fse.outputFile(
    `${projectDir}/.env`,
    `${database}\n\n${argon2}\n\n${session}\n\n${security}`
  );
};
