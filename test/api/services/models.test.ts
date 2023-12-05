import knex, { Knex } from 'knex';
import { SchemaInfo, getSchemaInfo } from '../../../src/api/database/inspector.js';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { Field, Model } from '../../../src/api/database/schemas.js';
import { FieldsService } from '../../../src/api/services/fields.js';
import { ModelsService } from '../../../src/api/services/models.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Model', () => {
  const databases = new Map<string, Knex>();

  const commonData = {
    singleton: false,
    hidden: false,
    statusField: null,
    draftValue: null,
    publishValue: null,
    archiveValue: null,
  };

  const data: Omit<Model, 'id'> = {
    model: 'ModelF12023DriverStandings',
    ...commonData,
  };

  const data1: Omit<Model, 'id'> = {
    model: 'ModelF12022DriverStandings',
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
        expect.objectContaining({ model: model, field: 'createdAt' }),
        expect.objectContaining({ model: model, field: 'updatedAt' }),
      ])
    );

    // columns
    const columns = schemaInfo[model].columns;
    expect(columns.id).toBeTruthy();
    expect(columns.createdAt).toBeTruthy();
    expect(columns.updatedAt).toBeTruthy();
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
      expect(meta.statusField).toBeNull();

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
      expect(meta.statusField).toBe('status');
      expect(meta.draftValue).toBe('draft');
      expect(meta.publishValue).toBe('published');
      expect(meta.archiveValue).toBe('archived');

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
