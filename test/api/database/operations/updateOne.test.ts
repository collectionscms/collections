import knex, { Knex } from 'knex';
import { createOne } from '../../../../src/api/database/operations/createOne.js';
import { readById } from '../../../../src/api/database/operations/readById.js';
import { updateOne } from '../../../../src/api/database/operations/updateOne.js';
import { getSchemaOverview } from '../../../../src/api/database/overview.js';
import { User } from '../../../../src/api/database/schemas.js';
import { config } from '../../../config.js';
import { testDatabases } from '../../../utilities/testDatabases.js';

describe('Update One', () => {
  const tableName = 'CollectionsUsers';
  const databases = new Map<string, Knex>();
  const data: Omit<User, 'id'> = {
    name: 'Daniel Ricciardo',
    email: 'daniel@collections.dev',
    password: 'password',
    isActive: true,
    apiKey: '1111-2222-4444',
    roleId: 1,
  };

  beforeAll(async () => {
    for (const database of testDatabases) {
      const connection = knex(config.knexConfig[database]!);
      databases.set(database, connection);
    }
  });

  afterAll(async () => {
    for (const [_, connection] of databases) {
      await connection.destroy();
    }
  });

  describe('Update', () => {
    it.each(testDatabases)('%s - should update', async (database) => {
      const connection = databases.get(database)!;
      const overview = await getSchemaOverview({ database: connection });
      const key = await createOne({
        database: connection,
        schema: overview,
        model: tableName,
        data,
      });

      const result = await updateOne({
        database: connection,
        schema: overview,
        model: tableName,
        key,
        data: {
          name: 'Daniel Ricciardo',
          apiKey: '1111-2222-3333',
        },
      });

      const fetchedResult = await readById({
        database: connection,
        schema: overview,
        model: tableName,
        key,
      });

      expect(result).toBeTruthy();
      expect(fetchedResult).toEqual(
        expect.objectContaining({
          name: 'Daniel Ricciardo',
          apiKey: '1111-2222-3333',
        })
      );
    });
  });
});
