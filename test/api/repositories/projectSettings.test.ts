import knex, { Knex } from 'knex';
import { ProjectSettingsRepository } from '../../../src/api/repositories/projectSettings.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Project Settings', () => {
  const tableName = 'superfast_project_settings';
  const databases = new Map<string, Knex>();

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
    it.each(testDatabases)('%s - should get', async (database) => {
      const connection = databases.get(database)!;

      const repository = new ProjectSettingsRepository(tableName, { knex: connection });
      const data = await repository.read({});

      expect(data[0].name).toBe('superfast');
      expect(data[0].before_login).toBe('Support Hours 9:00 - 18:00');
      expect(data[0].after_login).toBe('<a href="#">Contact us</a>');
    });
  });

  describe('Update', () => {
    it.each(testDatabases)('%s - should update', async (database) => {
      const connection = databases.get(database)!;

      const repository = new ProjectSettingsRepository(tableName, { knex: connection });
      const data = await repository.read({});
      const id = data[0].id;
      const newData = {
        name: 'superfast2',
        before_login: 'Support Hours 10:00 - 19:00',
        after_login: '<a href="#">support desk</a>',
      };

      const result = await repository.update(id, newData);
      const projectSetting = await repository.readOne(id);

      expect(result).toBeTruthy();
      expect(projectSetting.name).toBe(newData.name);
      expect(projectSetting.before_login).toBe(newData.before_login);
      expect(projectSetting.after_login).toBe(newData.after_login);

      const before = new Date(data[0].updated_at!).getTime();
      const after = new Date(projectSetting.updated_at!).getTime();

      expect(after).toBeGreaterThan(before);
    });

    it.each(testDatabases)('%s - should update fails', async (database) => {
      const connection = databases.get(database)!;
      const nonExistPrimaryKey = -1;

      const repository = new ProjectSettingsRepository(tableName, { knex: connection });
      const result = await repository.update(nonExistPrimaryKey, { name: 'superfast2' });
      expect(result).toBeFalsy();
    });
  });
});
