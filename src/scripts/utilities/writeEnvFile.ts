/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import fse from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import Output from './output';

export const writeEnvFile = async (projectDir: string, databaseName: string): Promise<void> => {
  Output.info('Create .env file.');
  const database = `DB_CLIENT="sqlite3"\nDB_FILENAME="./${databaseName}.db"\nMIGRATE_EXTENSIONS=".js"`;
  const argon2 = `HASH_MEMORY_COST=4096\nHASH_HASH_LENGTH=32\nHASH_TIME_COST=3\nHASH_PARALLELISM=1\nHASH_TYPE=2\n# HASH_ASSOCIATED_DATA="foo"`;
  const session = `ACCESS_TOKEN_TTL="8h"\nREFRESH_TOKEN_TTL="7d"`;
  const security = `SECRET="${uuidv4()}"`;
  const log = `LOG_LEVEL="info"`;
  const cors = `CORS_ENABLED=false\nCORS_ORIGIN=false\nCORS_METHODS="GET,POST,PATCH,DELETE"\nCORS_ALLOWED_HEADERS="Content-Type,Authorization"\nCORS_EXPOSED_HEADERS="Content-Range"\nCORS_CREDENTIALS=true\nCORS_MAX_AGE=18000`;

  await fse.outputFile(
    `${projectDir}/.env`,
    `${database}\n\n${argon2}\n\n${session}\n\n${security}\n\n${log}\n\n${cors}`
  );
};
