import knex, { Knex } from 'knex';
import { User } from '../../../src/api/database/schemas.js';
import { UsersRepository } from '../../../src/api/repositories/users.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Users', () => {
  const tableName = 'superfast_users';
  const databases = new Map<string, Knex>();

  const data: Omit<User, 'id'> = {
    name: 'Max Verstappen',
    email: 'max@superfastcms.com',
    password: 'password',
    is_active: true,
    api_key: '1111-2222-4444',
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
      const result = await repository.create(data);

      expect(result).toBeTruthy();
    });

    it.each(testDatabases)('%s - should throw foreign key constraint errors', async (database) => {
      const connection = databases.get(database)!;
      const unexpectedId = -1;

      const repository = new UsersRepository(tableName, { knex: connection });
      data.role_id = unexpectedId;
      const result = repository.create(data);

      expect(result).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it.each(testDatabases)('%s - should update', async (database) => {
      const connection = databases.get(database)!;

      const repository = new UsersRepository(tableName, { knex: connection });
      const user = (await repository.read({ email: 'michael@superfastcms.com' }))[0];

      const result = await repository.update(user.id, { name: 'Schumi' });
      const updatedUser = await repository.readOne(user.id);

      expect(result).toBeTruthy();
      expect(updatedUser.name).toBe('Schumi');

      const before = new Date(user.updated_at!).getTime();
      const after = new Date(updatedUser.updated_at!).getTime();

      expect(after).toBeGreaterThan(before);
    });
  });
});
