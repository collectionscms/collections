import knex, { Knex } from 'knex';
import { ProjectSettingsRepository } from '../../../src/server/repositories/projectSettings.js';
import { config, vendors } from '../../config.js';

describe('Project Settings', () => {
  const databases = new Map<string, Knex>();
  const tableName = 'superfast_project_settings';

  beforeAll(async () => {
    for (const vendor of vendors) {
      databases.set(vendor, knex(config.knexConfig[vendor]!));
    }
  });

  afterAll(async () => {
    for (const connection of databases) {
      await connection[1].destroy();
    }
  });

  describe('One project setting can be fetched', () => {
    it.each(vendors)('%s', async (vendor) => {
      const config = databases.get(vendor);

      const service = new ProjectSettingsRepository(tableName, { knex: config });
      const data = await service.read({});

      expect(data[0].name).toBe('superfast');
    });
  });

  describe('Project name can be updated', () => {
    it.each(vendors)('%s', async (vendor) => {
      const config = databases.get(vendor);

      const service = new ProjectSettingsRepository(tableName, { knex: config });
      const data = await service.read({});
      const id = data[0].id;
      const result = await service.update(id, { name: 'superfast2' });
      const projectSetting = await service.readOne(id);

      expect(result).toBeTruthy();
      expect(projectSetting.name).toBe('superfast2');
    });
  });

  describe('Project name update fails', () => {
    it.each(vendors)('%s', async (vendor) => {
      const config = databases.get(vendor);
      const nonExistPrimaryKey = -1;

      const service = new ProjectSettingsRepository(tableName, { knex: config });
      const result = await service.update(nonExistPrimaryKey, { name: 'superfast2' });

      expect(result).toBeFalsy();
    });
  });
});
