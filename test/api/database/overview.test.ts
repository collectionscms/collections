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
    it.each(testDatabases)('%s - should get meta & entity collections', async (database) => {
      const connection = databases.get(database)!;
      const overview = await getSchemaOverview({ database: connection });

      // check collections
      expect(Object.keys(overview.collections)).toEqual(
        expect.arrayContaining([
          'collection_f1_grand_prix_races',
          'superfast_roles',
          'superfast_users',
          'superfast_permissions',
          'superfast_collections',
          'superfast_fields',
          'superfast_relations',
          'superfast_project_settings',
          'superfast_files',
        ])
      );

      // check meta collection overview
      const meta = overview.collections['superfast_collections'];
      expect(meta).toEqual({
        id: overview.collections['superfast_collections'].id,
        collection: 'superfast_collections',
        singleton: false,
        statusField: null,
        draftValue: null,
        publishValue: null,
        archiveValue: null,
        fields: {
          id: { alias: false, special: null, field: 'id' },
          collection: { alias: false, special: null, field: 'collection' },
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

      // check entity collection overview
      const entity = overview.collections['collection_f1_grand_prix_races'];
      expect(entity).toEqual({
        id: overview.collections['collection_f1_grand_prix_races'].id,
        collection: 'collection_f1_grand_prix_races',
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
