import knex, { Knex } from 'knex';
import { ProjectSettingsRepository } from '../../../src/server/repositories/projectSettings.js';
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

  describe('One project setting can be fetched', () => {
    it.each(testDatabases)('%s', async (database) => {
      const connection = databases.get(database)!;

      const service = new ProjectSettingsRepository(tableName, { knex: connection });
      const data = await service.read({});

      expect(data[0].name).toBe('superfast');
    });
  });

  describe('Project name can be updated', () => {
    it.each(testDatabases)('%s', async (database) => {
      const connection = databases.get(database)!;

      const service = new ProjectSettingsRepository(tableName, { knex: connection });
      const data = await service.read({});
      const id = data[0].id;
      const result = await service.update(id, { name: 'superfast2' });
      const projectSetting = await service.readOne(id);

      expect(result).toBeTruthy();
      expect(projectSetting.name).toBe('superfast2');
    });
  });

  describe('Project name update fails', () => {
    it.each(testDatabases)('%s', async (database) => {
      const connection = databases.get(database)!;
      const nonExistPrimaryKey = -1;

      const service = new ProjectSettingsRepository(tableName, { knex: connection });
      const result = await service.update(nonExistPrimaryKey, { name: 'superfast2' });

      expect(result).toBeFalsy();
    });
  });
});
