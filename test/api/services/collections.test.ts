import knex, { Knex } from 'knex';
import { SchemaInfo, getSchemaInfo } from '../../../src/api/database/inspector.js';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { Field } from '../../../src/api/database/schemas.js';
import { CollectionsService } from '../../../src/api/services/collections.js';
import { FieldsService } from '../../../src/api/services/fields.js';
import { Collection, PostCollection } from '../../../src/config/types.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Collection', () => {
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

  const data1: Omit<PostCollection, 'id'> = {
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

  const expectCollectionFields = (collection: string, fields: Field[], schemaInfo: SchemaInfo) => {
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
      const schema = await getSchemaOverview({ database: connection });

      const collectionsService = new CollectionsService({ database: connection, schema });
      const fieldsService = new FieldsService({ database: connection, schema });

      const result = await collectionsService.createCollection(data);
      expect(result).toBeTruthy();

      const meta = await collectionsService.readOne(result);
      expect(meta.status_field).toBeNull();

      // check collection meta / columns
      const fields = await fieldsService.readMany({
        filter: { collection: { _eq: data.collection } },
      });
      const schemaInfo = await getSchemaInfo(connection);
      expectCollectionFields(data.collection, fields, schemaInfo);
    });

    it.each(testDatabases)('%s - should create with status', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const collectionsService = new CollectionsService({ database: connection, schema });
      const fieldsService = new FieldsService({ database: connection, schema });

      const result = await collectionsService.createCollection(data1);
      expect(result).toBeTruthy();

      const meta = await collectionsService.readOne(result);
      expect(meta.status_field).toBe('status');
      expect(meta.draft_value).toBe('draft');
      expect(meta.publish_value).toBe('published');
      expect(meta.archive_value).toBe('archived');

      // check collection meta / columns
      const fields = await fieldsService.readMany({
        filter: { collection: { _eq: data1.collection } },
      });
      const schemaInfo = await getSchemaInfo(connection);
      expectCollectionFields(data1.collection, fields, schemaInfo);
    });

    it.each(testDatabases)('%s - should throw not unique errors', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const collectionsService = new CollectionsService({ database: connection, schema });
      const result = collectionsService.createCollection(data);

      expect(result).rejects.toThrow();
    });
  });

  describe('Delete', () => {
    it.each(testDatabases)('%s - should delete', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const service = new CollectionsService({ database: connection, schema });

      const fetchedCollection = await service
        .readMany({
          filter: { collection: { _eq: data1.collection } },
        })
        .then((data) => data[0]);

      await service.deleteCollection(fetchedCollection.id);
      const data = await service.readOne(fetchedCollection.id);
      expect(data).toBeUndefined();
    });
  });
});
