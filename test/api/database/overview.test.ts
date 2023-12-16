import knex, { Knex } from 'knex';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Schema Overview', () => {
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
    it.each(testDatabases)('%s - should get meta & entity models', async (database) => {
      const connection = databases.get(database)!;
      const overview = await getSchemaOverview({ database: connection });

      // check models
      expect(Object.keys(overview.models)).toEqual(
        expect.arrayContaining([
          'ModelF1GrandPrixRaces',
          'CollectionsRoles',
          'CollectionsUsers',
          'CollectionsPermissions',
          'CollectionsModels',
          'CollectionsFields',
          'CollectionsRelations',
          'CollectionsProjectSettings',
          'CollectionsFiles',
        ])
      );

      // check meta model overview
      const meta = overview.models['CollectionsModels'];
      expect(meta).toEqual({
        id: overview.models['CollectionsModels'].id,
        model: 'CollectionsModels',
        singleton: false,
        statusField: null,
        draftValue: null,
        publishValue: null,
        archiveValue: null,
        source: null,
        fields: {
          id: { alias: false, interface: null, special: null, field: 'id' },
          model: { alias: false, interface: null, special: null, field: 'model' },
          singleton: { alias: false, interface: null, special: 'cast-boolean', field: 'singleton' },
          hidden: { alias: false, interface: null, special: 'cast-boolean', field: 'hidden' },
          statusField: { alias: false, interface: null, special: null, field: 'statusField' },
          draftValue: { alias: false, interface: null, special: null, field: 'draftValue' },
          publishValue: { alias: false, interface: null, special: null, field: 'publishValue' },
          archiveValue: { alias: false, interface: null, special: null, field: 'archiveValue' },
          source: { alias: false, interface: null, special: null, field: 'source' },
          createdAt: { alias: false, interface: null, special: null, field: 'createdAt' },
          updatedAt: { alias: false, interface: null, special: null, field: 'updatedAt' },
        },
      });

      // check entity model overview
      const entity = overview.models['ModelF1GrandPrixRaces'];
      expect(entity).toEqual({
        id: overview.models['ModelF1GrandPrixRaces'].id,
        model: 'ModelF1GrandPrixRaces',
        singleton: false,
        statusField: null,
        draftValue: null,
        publishValue: null,
        archiveValue: null,
        source: null,
        fields: {
          id: { alias: false, interface: 'input', special: null, field: 'id' },
          circuit: { alias: false, interface: 'input', special: null, field: 'circuit' },
          round: { alias: false, interface: 'input', special: null, field: 'round' },
          year: { alias: false, interface: 'input', special: null, field: 'year' },
          isShootout: {
            alias: false,
            interface: 'boolean',
            special: 'cast-boolean',
            field: 'isShootout',
          },
          circuitStats: {
            alias: true,
            interface: 'listOneToMany',
            special: null,
            field: 'circuitStats',
          },
          createdAt: { alias: false, interface: 'dateTime', special: null, field: 'createdAt' },
          updatedAt: { alias: false, interface: 'dateTime', special: null, field: 'updatedAt' },
        },
      });
    });
  });
});
