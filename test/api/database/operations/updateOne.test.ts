import knex, { Knex } from 'knex';
import { createOne } from '../../../../src/api/database/operations/createOne.js';
import { readById } from '../../../../src/api/database/operations/readById.js';
import { updateOne } from '../../../../src/api/database/operations/updateOne.js';
import { getSchemaOverview } from '../../../../src/api/database/overview.js';
import { User } from '../../../../src/config/types.js';
import { config } from '../../../config.js';
import { testDatabases } from '../../../utilities/testDatabases.js';

describe('Update One', () => {
  const tableName = 'superfast_users';
  const databases = new Map<string, Knex>();
  const data: Omit<User, 'id'> = {
    name: 'Daniel Ricciardo',
    email: 'daniel@superfastcms.com',
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

  describe('Update', () => {
    it.each(testDatabases)('%s - should update', async (database) => {
      const connection = databases.get(database)!;
      const overview = await getSchemaOverview({ database: connection });
      const key = await createOne({
        database: connection,
        schema: overview,
        collection: tableName,
        data,
      });

      const result = await updateOne({
        database: connection,
        schema: overview,
        collection: tableName,
        key,
        data: {
          name: 'Daniel Ricciardo',
          api_key: '1111-2222-3333',
        },
      });

      const fetchedResult = await readById({
        database: connection,
        schema: overview,
        collection: tableName,
        key,
      });

      expect(result).toBeTruthy();
      expect(fetchedResult).toEqual(
        expect.objectContaining({
          name: 'Daniel Ricciardo',
          api_key: '1111-2222-3333',
        })
      );
    });
  });
});
