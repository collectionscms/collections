import knex, { Knex } from 'knex';
import { createOne } from '../../../../src/api/database/operations/createOne.js';
import { getSchemaOverview } from '../../../../src/api/database/overview.js';
import { config } from '../../../config.js';
import { testDatabases } from '../../../utilities/testDatabases.js';
import { User } from '../../../../src/api/database/schemas.js';

describe('Create One', () => {
  const tableName = 'collections_users';
  const databases = new Map<string, Knex>();
  const data: Omit<User, 'id'> = {
    name: 'Lewis Hamilton',
    email: 'lewis@collections.dev',
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

  describe('Create', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;
      const overview = await getSchemaOverview({ database: connection });
      const result = await createOne({
        database: connection,
        schema: overview,
        model: tableName,
        data,
      });

      expect(result).toBeTruthy();
    });
  });
});
