import knex, { Knex } from 'knex';
import { createOne } from '../../../../src/api/database/operations/createOne.js';
import { readById } from '../../../../src/api/database/operations/readById.js';
import { getSchemaOverview } from '../../../../src/api/database/overview.js';
import { User } from '../../../../src/config/types.js';
import { config } from '../../../config.js';
import { testDatabases } from '../../../utilities/testDatabases.js';

describe('Read By Id', () => {
  const tableName = 'superfast_users';
  const databases = new Map<string, Knex>();
  const data: Omit<User, 'id'> = {
    name: 'Fernando Alonso',
    email: 'fernando@superfastcms.com',
    password: 'password',
    is_active: true,
    api_key: '1111-2222-4444',
    role_id: 1,
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

  describe('Get', () => {
    it.each(testDatabases)('%s - should get record', async (database) => {
      const connection = databases.get(database)!;
      const overview = await getSchemaOverview({ database: connection });
      const key = await createOne({
        database: connection,
        schema: overview,
        collection: tableName,
        data,
      });

      const result = await readById({
        database: connection,
        schema: overview,
        collection: tableName,
        key: key,
      });

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Fernando Alonso',
          email: 'fernando@superfastcms.com',
        })
      );
    });

    it.each(testDatabases)('%s - should get undefined for unknown id', async (database) => {
      const connection = databases.get(database)!;
      const overview = await getSchemaOverview({ database: connection });
      const result = await readById({
        database: connection,
        schema: overview,
        collection: tableName,
        key: -1,
      });

      expect(result).toBeUndefined();
    });
  });
});
