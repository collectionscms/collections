import knex, { Knex } from 'knex';
import { Collection } from '../../../src/api/database/schemas.js';
import { CollectionsRepository } from '../../../src/api/repositories/collections.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Collections', () => {
  const tableName = 'superfast_collections';
  const databases = new Map<string, Knex>();

  const data: Omit<Collection, 'id'> = {
    collection: 'collection_f1_constructors',
    singleton: false,
    hidden: false,
    status_field: null,
    draft_value: null,
    publish_value: null,
    archive_value: null,
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

  describe('Create', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;

      const repository = new CollectionsRepository(tableName, { knex: connection });
      const result = await repository.create(data);

      expect(result).toBeTruthy();
    });

    it.each(testDatabases)('%s - should throw not unique errors', async (database) => {
      const connection = databases.get(database)!;

      const repository = new CollectionsRepository(tableName, { knex: connection });
      const result = repository.create(data);

      expect(result).rejects.toThrow();
    });
  });
});
