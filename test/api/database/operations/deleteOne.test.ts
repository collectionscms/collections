import knex, { Knex } from 'knex';
import { createOne } from '../../../../src/api/database/operations/createOne.js';
import { deleteOne } from '../../../../src/api/database/operations/deleteOne.js';
import { readById } from '../../../../src/api/database/operations/readById.js';
import { getSchemaOverview } from '../../../../src/api/database/overview.js';
import { User } from '../../../../src/api/database/schemas.js';
import { config } from '../../../config.js';
import { testDatabases } from '../../../utilities/testDatabases.js';

describe('Delete One', () => {
  const tableName = 'superfast_users';
  const databases = new Map<string, Knex>();
  const data: Omit<User, 'id'> = {
    name: 'George Russell',
    email: 'george@superfastcms.com',
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

  describe('Delete', () => {
    it.each(testDatabases)('%s - should delete', async (database) => {
      const connection = databases.get(database)!;
      const overview = await getSchemaOverview({ database: connection });
      const key = await createOne({
        database: connection,
        schema: overview,
        model: tableName,
        data,
      });

      await deleteOne({
        database: connection,
        model: tableName,
        key,
      });

      const result = await readById({
        database: connection,
        schema: overview,
        model: tableName,
        key,
      });

      expect(result).toBeUndefined();
    });
  });
});
