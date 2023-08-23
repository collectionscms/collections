import knex, { Knex } from 'knex';
import { createMany } from '../../../../src/api/database/operations/createMany.js';
import { getSchemaOverview } from '../../../../src/api/database/overview.js';
import { User } from '../../../../src/config/types.js';
import { config } from '../../../config.js';
import { testDatabases } from '../../../utilities/testDatabases.js';

describe('Create Many', () => {
  const tableName = 'superfast_users';
  const databases = new Map<string, Knex>();
  const data: Omit<User, 'id'>[] = [
    {
      name: 'Charles Leclerc',
      email: 'charles@superfastcms.com',
      password: 'password',
      is_active: true,
      api_key: '1111-2222-4444',
      role_id: 1,
    },
    {
      name: 'Carlos Sainz',
      email: 'carlos@superfastcms.com',
      password: 'password',
      is_active: true,
      api_key: '1111-2222-4444',
      role_id: 1,
    },
  ];

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
      const result = await createMany({
        database: connection,
        schema: overview,
        collection: tableName,
        data,
      });

      expect(result).toHaveLength(2);
    });
  });
});
