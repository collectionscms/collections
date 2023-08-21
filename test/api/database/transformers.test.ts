import knex, { Knex } from 'knex';
import { describe } from 'node:test';
import { getHelpers } from '../../../src/api/database/helpers/index.js';
import { CollectionOverview } from '../../../src/api/database/overview.js';
import { applyTransformersToSpecialFields } from '../../../src/api/database/transformers.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Transformers', () => {
  const databases = new Map<string, Knex>();
  const mockOverview: CollectionOverview = {
    collection: 'mock_collections',
    singleton: false,
    statusField: null,
    draftValue: null,
    publishValue: null,
    archiveValue: null,
    fields: {
      id: { alias: false, special: null, field: 'id' },
      date: { alias: false, special: 'cast-timestamp', field: 'date' },
    },
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

  describe('applyTransformersToSpecialFields', () => {
    describe('action - create / update', () => {
      it.each(testDatabases)('%s - should get converted write timestamp', async (database) => {
        const connection = databases.get(database)!;
        const helper = getHelpers(connection);

        const now = new Date().toISOString();
        const content = { date: now };

        await applyTransformersToSpecialFields('create', content, mockOverview, helper);
        expect(content.date).toBe(helper.date.writeTimestamp(now));
      });

      it.each(testDatabases)('%s - should get null', async (database) => {
        const connection = databases.get(database)!;
        const helper = getHelpers(connection);

        const content = { date: null };

        await applyTransformersToSpecialFields('update', content, mockOverview, helper);
        expect(content.date).toBe(null);
      });

      it.each(testDatabases)('%s - should throw invalid payload', async (database) => {
        const connection = databases.get(database)!;
        const helper = getHelpers(connection);

        const content = { date: '2021-xx-29 09:00:00' };

        expect(
          applyTransformersToSpecialFields('create', content, mockOverview, helper)
        ).rejects.toThrow();
      });
    });

    describe('action - read', () => {
      it.each(testDatabases)('%s - should get converted read timestamp', async (database) => {
        const connection = databases.get(database)!;
        const helper = getHelpers(connection);

        const now = new Date().toISOString();
        const content = { date: now };

        await applyTransformersToSpecialFields('read', content, mockOverview, helper);
        expect(content.date).toBe(helper.date.readTimestampString(now));
      });
    });
  });
});
