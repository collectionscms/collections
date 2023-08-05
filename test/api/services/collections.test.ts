import knex, { Knex } from 'knex';
import { SchemaInfo, getSchemaInfo } from '../../../src/api/database/inspector.js';
import { FieldSchema } from '../../../src/api/database/schemas.js';
import { CollectionsRepository } from '../../../src/api/repositories/collections.js';
import { FieldsRepository } from '../../../src/api/repositories/fields.js';
import { CollectionsService } from '../../../src/api/services/collections.js';
import { Collection } from '../../../src/config/types.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

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

  const expectCollectionFields = (
    collection: string,
    fields: FieldSchema[],
    schemaInfo: SchemaInfo
  ) => {
    // meta
    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ collection: collection, field: 'id' }),
        expect.objectContaining({ collection: collection, field: 'created_at' }),
        expect.objectContaining({ collection: collection, field: 'updated_at' }),
      ])
    );

    // columns
    const columns = schemaInfo[collection].columns;
    expect(columns.id).toBeTruthy();
    expect(columns.created_at).toBeTruthy();
    expect(columns.updated_at).toBeTruthy();
  };

  describe('Create', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;
      const repository = new CollectionsRepository(tableName, { knex: connection });
      const fieldsRepository = new FieldsRepository(fieldsTableName, { knex: connection });
      const service = new CollectionsService(repository, fieldsRepository);

      const result = await service.createCollection(data);
      expect(result).toBeTruthy();

      const meta = await repository.readOne(result);
      expect(meta.status_field).toBeNull();

      // check collection meta / columns
      const fields = await fieldsRepository.read({ collection: data.collection });
      const schemaInfo = await getSchemaInfo(connection);
      expectCollectionFields(data.collection, fields, schemaInfo);
    });

    it.each(testDatabases)('%s - should create with status', async (database) => {
      const connection = databases.get(database)!;
      const repository = new CollectionsRepository(tableName, { knex: connection });
      const fieldsRepository = new FieldsRepository(fieldsTableName, { knex: connection });
      const service = new CollectionsService(repository, fieldsRepository);

      const result = await service.createCollection(data1);
      expect(result).toBeTruthy();

      const meta = await repository.readOne(result);
      expect(meta.status_field).toBe('status');
      expect(meta.draft_value).toBe('draft');
      expect(meta.publish_value).toBe('published');
      expect(meta.archive_value).toBe('archived');

      // check collection meta / columns
      const fields = await fieldsRepository.read({ collection: data1.collection });
      const schemaInfo = await getSchemaInfo(connection);
      expectCollectionFields(data1.collection, fields, schemaInfo);
    });
  });
});
