import dayjs from 'dayjs';
import knex, { Knex } from 'knex';
import { describe } from 'node:test';
import { getHelpers } from '../../../src/api/database/helpers/index.js';
import { ModelOverview } from '../../../src/api/database/overview.js';
import { applyTransformers } from '../../../src/api/database/transformers.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Transformers', () => {
  const databases = new Map<string, Knex>();
  const overview: ModelOverview = {
    id: 1,
    model: 'mock_models',
    singleton: false,
    statusField: null,
    draftValue: null,
    publishValue: null,
    archiveValue: null,
    fields: {
      id: { alias: false, special: null, field: 'id' },
      created_at: { alias: false, special: null, field: 'created_at' },
      updated_at: { alias: false, special: null, field: 'updated_at' },
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

  describe('applyTransformers', () => {
    it.each(testDatabases)(
      '%s - should apply create action transform to the given data',
      async (database) => {
        const connection = databases.get(database)!;
        const helper = getHelpers(connection);

        const timestamp = '2022-01-01T00:00:00.000Z';
        const date = dayjs(timestamp).toISOString();
        const data = {
          created_at: null,
          updated_at: null,
          date,
        };

        await applyTransformers('create', data, overview, helper);

        expect(data.created_at).not.toBeNull();
        expect(data.updated_at).not.toBeNull();
        expect(data.date).toBe(helper.date.writeTimestamp(date));
      }
    );

    it.each(testDatabases)(
      '%s - should apply update action transform to the given data',
      async (database) => {
        const connection = databases.get(database)!;
        const helper = getHelpers(connection);

        const timestamp = '2022-01-01T00:00:00.000Z';
        const date = dayjs(timestamp).toISOString();
        const data = {
          created_at: date,
          updated_at: date,
          date,
        };

        await applyTransformers('update', data, overview, helper);
        const formattedDate = helper.date.writeTimestamp(date);
        expect(data.created_at).toBe(formattedDate);
        expect(data.updated_at).not.toBe(formattedDate);
        expect(data.date).toBe(formattedDate);
      }
    );

    it.each(testDatabases)(
      '%s - should apply read action transform to the given data',
      async (database) => {
        const connection = databases.get(database)!;
        const helper = getHelpers(connection);

        const timestamp = '2022-01-01T00:00:00.000Z';
        const date = dayjs(timestamp).toISOString();
        const data = {
          created_at: date,
          updated_at: date,
          date,
        };

        await applyTransformers('read', data, overview, helper);

        expect(data.created_at).toBe(timestamp);
        expect(data.updated_at).toBe(timestamp);
        expect(data.date).toBe(timestamp);
      }
    );

    it.each(testDatabases)('%s - should not apply', async (database) => {
      const connection = databases.get(database)!;
      const helper = getHelpers(connection);

      const data = {
        date: null,
        not_in_overview: 'value',
      };

      await applyTransformers('update', data, overview, helper);
      expect(data.date).toBe(null);
      expect(data.not_in_overview).toBe('value');
    });

    it.each(testDatabases)('%s - should throw invalid payload', async (database) => {
      const connection = databases.get(database)!;
      const helper = getHelpers(connection);

      const data = { date: '2021-xx-29 09:00:00' };

      expect(applyTransformers('create', data, overview, helper)).rejects.toThrow();
    });
  });
});
