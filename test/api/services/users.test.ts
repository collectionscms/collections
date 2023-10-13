import knex, { Knex } from 'knex';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { User } from '../../../src/api/database/schemas.js';
import { UsersService } from '../../../src/api/services/users.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Users', () => {
  const databases = new Map<string, Knex>();

  const data: Omit<User, 'id'> = {
    name: 'Max Verstappen',
    email: 'max@collections.dev',
    password: 'password',
    isActive: true,
    apiKey: '1111-2222-4444',
    roleId: 1,
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

  describe('Get', () => {
    it.each(testDatabases)('%s - should get with role', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const service = new UsersService({ database: connection, schema });
      const users = await service.readWithRole();

      expect(users).toBeTruthy();

      const user = users.find((user) => user.email === 'michael@collections.dev');

      expect(user).toEqual(
        expect.objectContaining({
          name: 'Michael Schumacher',
          email: 'michael@collections.dev',
          isActive: true,
          roleId: 1,
          roleName: 'Administrator',
          roleAdminAccess: true,
        })
      );
    });
  });

  describe('Create', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const service = new UsersService({ database: connection, schema });
      const result = await service.createOne(data);

      expect(result).toBeTruthy();
    });

    it.each(testDatabases)('%s - should throw foreign key constraint errors', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const unexpectedId = -1;

      const service = new UsersService({ database: connection, schema });
      data.roleId = unexpectedId;
      const result = service.createOne(data);

      expect(result).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it.each(testDatabases)('%s - should update', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const service = new UsersService({ database: connection, schema });
      const user = await service
        .readMany({ filter: { email: { _eq: 'michael@collections.dev' } } })
        .then((users) => users[0]);

      const result = await service.updateOne(user.id, { name: 'Schumi' });
      const updatedUser = await service.readOne(user.id);

      expect(result).toBeTruthy();
      expect(updatedUser.name).toBe('Schumi');

      const before = new Date(user.updatedAt!).getTime();
      const after = new Date(updatedUser.updatedAt!).getTime();

      expect(after).toBeGreaterThan(before);
    });
  });
});
