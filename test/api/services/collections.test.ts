import knex, { Knex } from 'knex';
import { CollectionsRepository } from '../../../src/api/repositories/collections.js';
import { FieldsRepository } from '../../../src/api/repositories/fields.js';
import { CollectionsService } from '../../../src/api/services/collections.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';
import { Collection } from '../../../src/config/types.js';

describe('Collection', () => {
  const tableName = 'superfast_collections';
  const fieldsTableName = 'superfast_fields';
  const databases = new Map<string, Knex>();

  const commonData = {
    singleton: false,
    hidden: false,
    status_field: null,
    draft_value: null,
    publish_value: null,
    archive_value: null,
  };

  const data: Omit<Collection, 'id'> = {
    collection: 'collection_f1_2023_driver_standings',
    ...commonData,
  };

  const data1: Omit<Collection, 'id'> = {
    collection: 'collection_f1_2022_driver_standings',
    status: true,
    ...commonData,
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
      const fieldsRepository = new FieldsRepository(fieldsTableName, { knex: connection });
      const service = new CollectionsService(repository, fieldsRepository);

      const result = await service.createCollection(data);
      expect(result).toBeTruthy();

      const collection = await repository.readOne(result);
      expect(collection.status_field).toBeNull();
    });

    it.each(testDatabases)('%s - should create with status', async (database) => {
      const connection = databases.get(database)!;
      const repository = new CollectionsRepository(tableName, { knex: connection });
      const fieldsRepository = new FieldsRepository(fieldsTableName, { knex: connection });
      const service = new CollectionsService(repository, fieldsRepository);

      const result = await service.createCollection(data1);
      expect(result).toBeTruthy();

      const collection = await repository.readOne(result);
      expect(collection.status_field).toBe('status');
      expect(collection.draft_value).toBe('draft');
      expect(collection.publish_value).toBe('published');
      expect(collection.archive_value).toBe('archived');
    });
  });
});
