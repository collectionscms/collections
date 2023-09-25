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
          'model_f1_grand_prix_races',
          'superfast_roles',
          'superfast_users',
          'superfast_permissions',
          'superfast_models',
          'superfast_fields',
          'superfast_relations',
          'superfast_project_settings',
          'superfast_files',
        ])
      );

      // check meta model overview
      const meta = overview.models['superfast_models'];
      expect(meta).toEqual({
        id: overview.models['superfast_models'].id,
        model: 'superfast_models',
        singleton: false,
        statusField: null,
        draftValue: null,
        publishValue: null,
        archiveValue: null,
        fields: {
          id: { alias: false, special: null, field: 'id' },
          model: { alias: false, special: null, field: 'model' },
          singleton: { alias: false, special: 'cast-boolean', field: 'singleton' },
          hidden: { alias: false, special: 'cast-boolean', field: 'hidden' },
          status_field: { alias: false, special: null, field: 'status_field' },
          draft_value: { alias: false, special: null, field: 'draft_value' },
          publish_value: { alias: false, special: null, field: 'publish_value' },
          archive_value: { alias: false, special: null, field: 'archive_value' },
          created_at: { alias: false, special: null, field: 'created_at' },
          updated_at: { alias: false, special: null, field: 'updated_at' },
        },
      });

      // check entity model overview
      const entity = overview.models['model_f1_grand_prix_races'];
      expect(entity).toEqual({
        id: overview.models['model_f1_grand_prix_races'].id,
        model: 'model_f1_grand_prix_races',
        singleton: false,
        statusField: null,
        draftValue: null,
        publishValue: null,
        archiveValue: null,
        fields: {
          id: { alias: false, special: null, field: 'id' },
          circuit: { alias: false, special: null, field: 'circuit' },
          round: { alias: false, special: null, field: 'round' },
          year: { alias: false, special: null, field: 'year' },
          is_shootout: { alias: false, special: 'cast-boolean', field: 'is_shootout' },
          circuit_stats: { alias: true, special: null, field: 'circuit_stats' },
          created_at: { alias: false, special: null, field: 'created_at' },
          updated_at: { alias: false, special: null, field: 'updated_at' },
        },
      });
    });
  });
});
