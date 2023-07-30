import knex, { Knex } from 'knex';
import { FieldsRepository } from '../../../src/api/repositories/fields.js';
import { FieldsService } from '../../../src/api/services/fields.js';
import { Field } from '../../../src/config/types.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Field', () => {
  const tableName = 'superfast_fields';
  const databases = new Map<string, Knex>();

  const data = {
    collection: 'collection_formula_one_constructors',
    interface: 'input',
    required: false,
    readonly: false,
    hidden: false,
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
      const repository = new FieldsRepository(tableName, { knex: connection });
      const service = new FieldsService(repository);

      const field = {
        ...data,
        field: 'team_name',
        label: 'Team Name',
      } as Omit<Field, 'id'>;

      const result = await service.createField(field);
      expect(result).toBeTruthy();
    });

    it.each(testDatabases)('%s - should throw on duplication column error', async (database) => {
      const connection = databases.get(database)!;
      const repository = new FieldsRepository(tableName, { knex: connection });
      const service = new FieldsService(repository);

      const field = {
        ...data,
        field: 'point',
        label: 'Point',
      } as Omit<Field, 'id'>;

      const fieldSuccess = await service.createField(field);
      expect(fieldSuccess).toBeTruthy();

      const fieldFail = service.createField(field);
      await expect(fieldFail).rejects.toThrow();

      // meta data should not be created
      const fetchFields = await repository.read({
        collection: 'collection_formula_one_constructors',
        field: 'point',
      });

      expect(fetchFields).toHaveLength(1);
    });

    it.each(testDatabases)(
      '%s - should throw on duplication system column error',
      async (database) => {
        const connection = databases.get(database)!;
        const repository = new FieldsRepository(tableName, { knex: connection });
        const service = new FieldsService(repository);

        const field = {
          ...data,
          field: 'created_at',
          label: 'Created At',
        } as Omit<Field, 'id'>;

        const result = service.createField(field);
        await expect(result).rejects.toThrow();

        // meta data should not be created
        const fetchFields = await repository.read({
          collection: 'collection_formula_one_constructors',
          field: 'created_at',
        });

        expect(fetchFields).toHaveLength(0);
      }
    );
  });
});
