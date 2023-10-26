import knex, { Knex } from 'knex';
import { getSchemaOverview } from '../../../src/api/database/overview.js';
import { Field, Model } from '../../../src/api/database/schemas.js';
import { FieldsService } from '../../../src/api/services/fields.js';
import { ModelsService } from '../../../src/api/services/models.js';
import { config } from '../../config.js';
import { testDatabases } from '../../utilities/testDatabases.js';

describe('Field', () => {
  const modelName = 'ModelF1FerrariTeamStats';
  const relationalModelName = 'ModelF1FerrariDrivers';
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

  const relationalModelData: Omit<Model, 'id'> = {
    model: relationalModelName,
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
      await createRelationalModel(database);
    }
  });

  const createModel = async (database: string) => {
    const connection = databases.get(database)!;
    const schema = await getSchemaOverview({ database: connection });

    const service = new ModelsService({ database: connection, schema });
    await service.createModel(modelData, false);
  };

  const createRelationalModel = async (database: string) => {
    const connection = databases.get(database)!;
    const schema = await getSchemaOverview({ database: connection });

    const service = new ModelsService({ database: connection, schema });
    await service.createModel(relationalModelData, false);
  };

  afterAll(async () => {
    for (const [_, connection] of databases) {
      await connection.destroy();
    }
  });

  describe('Create Field', () => {
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

  describe('Create Relational Field', () => {
    it.each(testDatabases)('%s - should create', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const service = new FieldsService({ database: connection, schema });
      const modelsService = new ModelsService({ database: connection, schema });

      const oneModel = await modelsService
        .readMany({
          filter: { model: { _eq: modelName } },
        })
        .then((data) => data[0]);

      const manyModel = await modelsService
        .readMany({
          filter: { model: { _eq: relationalModelName } },
        })
        .then((data) => data[0]);

      const relation = {
        manyModel: manyModel.model,
        manyModelId: manyModel.id,
        manyField: 'teamStatId',
        oneModel: oneModel.model,
        oneModelId: oneModel.id,
        oneField: 'drivers',
      };

      const fields = [
        {
          model: oneModel.model,
          modelId: oneModel.id,
          field: 'drivers',
          label: 'Drivers',
          interface: 'listOneToMany',
          required: false,
          readonly: false,
          hidden: false,
        },
        {
          model: manyModel.model,
          modelId: manyModel.id,
          field: 'teamStatId',
          label: 'Team Stat Id',
          interface: 'selectDropdownManyToOne',
          required: false,
          readonly: false,
          hidden: true,
        },
      ] as Omit<Field, 'id'>[];

      const result = await service.createRelationalFields(relation, fields);
      expect(result).toBeTruthy();
    });

    it.each(testDatabases)('%s - should throw on duplication column error', async (database) => {
      const connection = databases.get(database)!;
      const schema = await getSchemaOverview({ database: connection });
      const service = new FieldsService({ database: connection, schema });
      const modelsService = new ModelsService({ database: connection, schema });

      // add duplicate field
      const field = {
        ...fieldData,
        modelId: schema.models[modelName].id,
        field: 'base',
        label: 'Base',
      } as Omit<Field, 'id'>;

      await service.createField(field);

      const oneModel = await modelsService
        .readMany({
          filter: { model: { _eq: modelName } },
        })
        .then((data) => data[0]);

      const manyModel = await modelsService
        .readMany({
          filter: { model: { _eq: relationalModelName } },
        })
        .then((data) => data[0]);

      const relation = {
        manyModel: manyModel.model,
        manyModelId: manyModel.id,
        manyField: 'teamStatId2',
        oneModel: oneModel.model,
        oneModelId: oneModel.id,
        oneField: field.field,
      };

      const fields = [
        {
          model: oneModel.model,
          modelId: oneModel.id,
          field: field.field,
          label: field.label,
          interface: 'listOneToMany',
          required: false,
          readonly: false,
          hidden: false,
        },
        {
          model: manyModel.model,
          modelId: manyModel.id,
          field: 'teamStatId2',
          label: 'Team Stat Id',
          interface: 'selectDropdownManyToOne',
          required: false,
          readonly: false,
          hidden: true,
        },
      ] as Omit<Field, 'id'>[];

      const result = service.createRelationalFields(relation, fields);
      await expect(result).rejects.toThrow();
    });
  });

  describe('Delete Field', () => {
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
