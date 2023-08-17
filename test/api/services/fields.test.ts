import knex, { Knex } from 'knex';
import { CollectionsRepository } from '../../../src/api/repositories/collections.js';
import { FieldsRepository } from '../../../src/api/repositories/fields.js';
import { CollectionsService } from '../../../src/api/services/collections_deprecated.js';
import { FieldsService } from '../../../src/api/services/fields.js';
import { Collection, Field } from '../../../src/config/types.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Field', () => {
  const collectionsTableName = 'superfast_collections';
  const fieldsTableName = 'superfast_fields';
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
    const repository = new CollectionsRepository(collectionsTableName, { knex: connection });
    const fieldsRepository = new FieldsRepository(fieldsTableName, { knex: connection });
    const service = new CollectionsService(repository, fieldsRepository);

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
      const repository = new FieldsRepository(fieldsTableName, { knex: connection });
      const service = new FieldsService(repository);

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
      const repository = new FieldsRepository(fieldsTableName, { knex: connection });
      const service = new FieldsService(repository);

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
      const fetchFields = await repository.read({
        collection: collectionName,
        field: 'point',
      });

      expect(fetchFields).toHaveLength(1);
    });

    it.each(testDatabases)(
      '%s - should throw on duplication system column error',
      async (database) => {
        const connection = databases.get(database)!;
        const repository = new FieldsRepository(fieldsTableName, { knex: connection });
        const service = new FieldsService(repository);

        const field = {
          ...fieldData,
          field: 'id',
          label: 'id',
        } as Omit<Field, 'id'>;

        const result = service.createField(field);
        await expect(result).rejects.toThrow();

        // meta data should not be duplicated.
        const fetchFields = await repository.read({
          collection: collectionName,
          field: 'id',
        });

        expect(fetchFields).toHaveLength(1);
      }
    );
  });
});
