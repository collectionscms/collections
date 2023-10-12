import knex, { Knex } from 'knex';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { Model, Field } from '../../../src/api/database/schemas.js';
import { ModelsService } from '../../../src/api/services/models.js';
import { FieldsService } from '../../../src/api/services/fields.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Field', () => {
  const modelName = 'ModelF1FerrariTeamStats';
  const databases = new Map<string, Knex>();

  const modelData: Omit<Model, 'id'> = {
    model: modelName,
    singleton: false,
    hidden: false,
    statusField: null,
    draftValue: null,
    publishValue: null,
    archiveValue: null,
  };

  const fieldData = {
    model: modelName,
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

      await createModel(database);
    }
  });

  const createModel = async (database: string) => {
    const connection = databases.get(database)!;
    const schema = await getSchemaOverview({ database: connection });

    const service = new ModelsService({ database: connection, schema });
    await service.createModel(modelData, false);
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
        modelId: schema.models[modelName].id,
        field: 'teamName',
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
        modelId: schema.models[modelName].id,
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
          _and: [{ model: { _eq: modelName } }, { field: { _eq: 'point' } }],
        },
      });

      expect(fetchFields).toHaveLength(1);
    });

    it.each(testDatabases)(
      '%s - should throw on duplication system column error',
      async (database) => {
        const connection = databases.get(database)!;
        const schema = await getSchemaOverview({ database: connection });
        const service = new FieldsService({ database: connection, schema });

        const field = {
          ...fieldData,
          modelId: schema.models[modelName].id,
          field: 'id',
          label: 'id',
        } as Omit<Field, 'id'>;

        const result = service.createField(field);
        await expect(result).rejects.toThrow();

        // meta data should not be duplicated.
        const fetchFields = await service.readMany({
          filter: {
            _and: [{ model: { _eq: modelName } }, { field: { _eq: 'id' } }],
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
          filter: { field: { _eq: 'teamName' } },
        })
        .then((data) => data[0]);

      await service.deleteField(field.id);
      const data = await service.readOne(field.id);
      expect(data).toBeUndefined();
    });
  });
});
