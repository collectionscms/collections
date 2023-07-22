import knex, { Knex } from 'knex';
import { User } from '../../../src/api/database/schemas.js';
import { UsersRepository } from '../../../src/api/repositories/users.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Users', () => {
  const tableName = 'superfast_users';
  const databases = new Map<string, Knex>();

  const user: Omit<User, 'id'> = {
    name: 'test',
    email: 'test@example.com',
    password: 'password',
    is_active: true,
    api_key: '1111-2222-3333',
    role_id: 1,
  };

  beforeAll(async () => {
    for (const database of testDatabases) {
      databases.set(database, knex(config.knexConfig[database]!));
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

      const repository = new UsersRepository(tableName, { knex: connection });
      const result = await repository.create(user);

      expect(result).toBeTruthy();
    });

    it.each(testDatabases)('%s - should throw foreign key constraint errors', async (database) => {
      const connection = databases.get(database)!;
      const unexpectedId = -1;

      const repository = new UsersRepository(tableName, { knex: connection });
      user.role_id = unexpectedId;
      const result = repository.create(user);

      expect(result).rejects.toThrow();
    });
  });
});
