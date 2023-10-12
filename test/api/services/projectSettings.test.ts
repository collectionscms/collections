import knex, { Knex } from 'knex';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { ProjectSettingsService } from '../../../src/api/services/projectSettings.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Project Settings', () => {
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
      const schema = await getSchemaOverview({ database: connection });

      const service = new ProjectSettingsService({ database: connection, schema });
      const data = await service.readMany({});

      expect(data[0].name).toBe('collections');
      expect(data[0].beforeLogin).toBe('Support Hours 9:00 - 18:00');
      expect(data[0].afterLogin).toBe('<a href="#">Contact us</a>');
    });
  });

  describe('Update', () => {
    it.each(testDatabases)('%s - should update', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const service = new ProjectSettingsService({ database: connection, schema });
      const data = await service.readMany({});
      const id = data[0].id;
      const newData = {
        name: 'collections2',
        beforeLogin: 'Support Hours 10:00 - 19:00',
        afterLogin: '<a href="#">support desk</a>',
      };

      const result = await service.updateOne(id, newData);
      const projectSetting = await service.readOne(id);

      expect(result).toBeTruthy();
      expect(projectSetting.name).toBe(newData.name);
      expect(projectSetting.beforeLogin).toBe(newData.beforeLogin);
      expect(projectSetting.afterLogin).toBe(newData.afterLogin);

      const before = new Date(data[0].updatedAt!).getTime();
      const after = new Date(projectSetting.updatedAt!).getTime();

      expect(after).toBeGreaterThan(before);
    });

    it.each(testDatabases)('%s - should update fails', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const nonExistPrimaryKey = -1;

      const service = new ProjectSettingsService({ database: connection, schema });
      const result = await service.updateOne(nonExistPrimaryKey, { name: 'collections2' });
      expect(result).toBeFalsy();
    });
  });
});
