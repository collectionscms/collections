import knex, { Knex } from 'knex';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { CollectionsService } from '../../../src/api/services/collections.js';
import { FieldsService } from '../../../src/api/services/fields.js';
import { Collection, Field } from '../../../src/config/types.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Field', () => {
  const collectionName = 'collection_f1_ferrari_team_stats';
  const databases = new Map<string, Knex>();

  const collectionData: Omit<Collection, 'id'> = {
    collection: collectionName,
    singleton: false,
    hidden: false,
    status_field: null,
    draft_value: null,
    publish_value: null,
    archive_value: null,
  };

  const fieldData: Omit<Field, 'id'> = {
    collection: collectionName,
    interface: 'input',
    required: false,
    readonly: false,
    hidden: false,
    field: '',
    label: '',
    special: null,
    options: null,
    sort: null,
  };

  beforeAll(async () => {
    for (const database of testDatabases) {
      databases.set(database, knex(config.knexConfig[database]!));

      await createCollection(database);
    }
  });

  const createCollection = async (database: string) => {
    const connection = databases.get(database)!;
    const schema = await getSchemaOverview({ database: connection });

    const service = new CollectionsService({ database: connection, schema });
    await service.createCollection(collectionData);
  };

  afterAll(async () => {
    for (const [_, connection] of databases) {
      await connection.destroy();
    }
  });

  describe('Create', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const service = new FieldsService({ database: connection, schema });

      const field = {
        ...fieldData,
        field: 'team_name',
        label: 'Team Name',
      } as Omit<Field, 'id'>;

      const result = await service.createField(field);
      expect(result).toBeTruthy();
    });

    it.each(testDatabases)('%s - should throw on duplication column error', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const service = new FieldsService({ database: connection, schema });

      const field = {
        ...fieldData,
        field: 'point',
        label: 'Point',
      } as Omit<Field, 'id'>;

      const fieldSuccess = await service.createField(field);
      expect(fieldSuccess).toBeTruthy();

      const fieldFail = service.createField(field);
      await expect(fieldFail).rejects.toThrow();

      // meta data should not be created
      const fetchFields = await service.readMany({
        filter: {
          _and: [{ collection: { _eq: collectionName } }, { field: { _eq: 'point' } }],
        },
      });

      expect(fetchFields).toHaveLength(1);
    });

    it.each(testDatabases)(
      '%s - should throw on duplication system column error',
      async (database) => {
        const field = {
          ...fieldData,
          field: 'id',
          label: 'id',
        } as Omit<Field, 'id'>;

        const connection = databases.get(database)!;
        const schema = await getSchemaOverview({ database: connection });
        const service = new FieldsService({ database: connection, schema });

        const result = service.createField(field);
        await expect(result).rejects.toThrow();

        // meta data should not be duplicated.
        const fetchFields = await service.readMany({
          filter: {
            _and: [{ collection: { _eq: collectionName } }, { field: { _eq: 'id' } }],
          },
        });

        expect(fetchFields).toHaveLength(1);
      }
    );
  });

  describe('Delete', () => {
    it.each(testDatabases)('%s - should delete', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const service = new FieldsService({ database: connection, schema });

      const field = await service
        .readMany({
          filter: { field: { _eq: 'team_name' } },
        })
        .then((data) => data[0]);

      await service.deleteField(field.id);
      const data = await service.readOne(field.id);
      expect(data).toBeUndefined();
    });
  });
});
