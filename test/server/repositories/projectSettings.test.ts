import knex from 'knex';
import { ProjectSettingsRepository } from '../../../src/server/repositories/projectSettings.js';
import { config } from '../../config.js';
import { testVendors } from '../../utilities/testVendors.js';

describe('Project Settings', () => {
  const tableName = 'superfast_project_settings';

  describe('One project setting can be fetched', () => {
    it.each(testVendors)('%s', async (vendor) => {
      const connection = knex(config.knexConfig[vendor]);

      const service = new ProjectSettingsRepository(tableName, { knex: connection });
      const data = await service.read({});

      expect(data[0].name).toBe('superfast');
    });
  });

  describe('Project name can be updated', () => {
    it.each(testVendors)('%s', async (vendor) => {
      const connection = knex(config.knexConfig[vendor]);
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
    it.each(testVendors)('%s', async (vendor) => {
      const connection = knex(config.knexConfig[vendor]);
      const nonExistPrimaryKey = -1;

      const service = new ProjectSettingsRepository(tableName, { knex: connection });
      const result = await service.update(nonExistPrimaryKey, { name: 'superfast2' });

      expect(result).toBeFalsy();
    });
  });
});
