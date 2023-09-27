import knex, { Knex } from 'knex';
import { SchemaInfo, getSchemaInfo } from '../../../src/api/database/inspector.js';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { Model, Field } from '../../../src/api/database/schemas.js';
import { ModelsService } from '../../../src/api/services/models.js';
import { FieldsService } from '../../../src/api/services/fields.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Model', () => {
  const databases = new Map<string, Knex>();

  const commonData = {
    singleton: false,
    hidden: false,
    status_field: null,
    draft_value: null,
    publish_value: null,
    archive_value: null,
  };

  const data: Omit<Model, 'id'> = {
    model: 'model_f1_2023_driver_standings',
    ...commonData,
  };

  const data1: Omit<Model, 'id'> = {
    model: 'model_f1_2022_driver_standings',
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

  const expectModelFields = (model: string, fields: Field[], schemaInfo: SchemaInfo) => {
    // meta
    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ model: model, field: 'id' }),
        expect.objectContaining({ model: model, field: 'created_at' }),
        expect.objectContaining({ model: model, field: 'updated_at' }),
      ])
    );

    // columns
    const columns = schemaInfo[model].columns;
    expect(columns.id).toBeTruthy();
    expect(columns.created_at).toBeTruthy();
    expect(columns.updated_at).toBeTruthy();
  };

  describe('Create', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const modelsService = new ModelsService({ database: connection, schema });
      const fieldsService = new FieldsService({ database: connection, schema });

      const result = await modelsService.createModel(data, false);
      expect(result).toBeTruthy();

      const meta = await modelsService.readOne(result);
      expect(meta.status_field).toBeNull();

      // check model meta / columns
      const fields = await fieldsService.readMany({
        filter: { model: { _eq: data.model } },
      });
      const schemaInfo = await getSchemaInfo(connection);
      expectModelFields(data.model, fields, schemaInfo);
    });

    it.each(testDatabases)('%s - should create with status', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const modelsService = new ModelsService({ database: connection, schema });
      const fieldsService = new FieldsService({ database: connection, schema });

      const result = await modelsService.createModel(data1, true);
      expect(result).toBeTruthy();

      const meta = await modelsService.readOne(result);
      expect(meta.status_field).toBe('status');
      expect(meta.draft_value).toBe('draft');
      expect(meta.publish_value).toBe('published');
      expect(meta.archive_value).toBe('archived');

      // check model meta / columns
      const fields = await fieldsService.readMany({
        filter: { model: { _eq: data1.model } },
      });
      const schemaInfo = await getSchemaInfo(connection);
      expectModelFields(data1.model, fields, schemaInfo);
    });

    it.each(testDatabases)('%s - should throw not unique errors', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });

      const modelsService = new ModelsService({ database: connection, schema });
      const result = modelsService.createModel(data, false);

      expect(result).rejects.toThrow();
    });
  });

  describe('Delete', () => {
    it.each(testDatabases)('%s - should delete', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const service = new ModelsService({ database: connection, schema });

      const fetchedModel = await service
        .readMany({
          filter: { model: { _eq: data1.model } },
        })
        .then((data) => data[0]);

      await service.deleteModel(fetchedModel.id);
      const data = await service.readOne(fetchedModel.id);
      expect(data).toBeUndefined();
    });
  });
});
