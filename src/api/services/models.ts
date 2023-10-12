import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { Field, Model, PrimaryKey } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';
import { FieldsService } from './fields.js';
import { PermissionsService } from './permissions.js';
import { RelationsService } from './relations.js';

export class ModelsService extends BaseService<Model> {
  constructor(options: AbstractServiceOptions) {
    super('CollectionsModels', options);
  }

  /**
   * @description Create model with system fields
   * @param data
   * @param status
   * @returns primary key
   */
  async createModel(data: Omit<Model, 'id'>, status: boolean): Promise<PrimaryKey> {
    await this.checkUniqueModel(data.model);

    const fullData: Omit<Model, 'id'> = status
      ? {
          ...data,
          status_field: 'status',
          draft_value: 'draft',
          publish_value: 'published',
          archive_value: 'archived',
        }
      : data;

    const modelId = await this.database.transaction(async (tx) => {
      const modelsService = new ModelsService({ database: tx, schema: this.schema });
      const modelId = await modelsService.createOne(fullData);

      await tx.schema.createTable(data.model, (table) => {
        table.increments();
        table.timestamps(true, true);
        status && table.string('status').notNullable();
      });

      const fieldsService = new FieldsService({ database: tx, schema: this.schema });
      const fields = this.buildFields(modelId, data, status || false);
      await fieldsService.createMany(fields);

      return modelId;
    });

    return modelId;
  }

  /**
   * @description Update a model
   * @param key
   * @param data
   */
  async updateModel(key: PrimaryKey, data: Omit<Model, 'id'>): Promise<void> {
    await this.database.transaction(async (tx) => {
      const service = new ModelsService({ database: tx, schema: this.schema });
      await service.updateOne(key, data);

      if (data.status_field) {
        const model = await service.readOne(key);

        const fieldsService = new FieldsService({ database: tx, schema: this.schema });
        const fields = await fieldsService.readMany({
          filter: {
            _and: [{ model: { _eq: model.model } }, { field: { _eq: data.status_field } }],
          },
        });

        await fieldsService.updateOne(fields[0].id, {
          interface: 'selectDropdownStatus',
          required: true,
          options: JSON.stringify({
            choices: [
              { label: data.draft_value, value: data.draft_value },
              { label: data.publish_value, value: data.publish_value },
              { label: data.archive_value, value: data.archive_value },
            ],
          }),
        });
      }
    });
  }

  /**
   * @description Delete a model
   * Execute in order of relation -> entity to avoid DB constraint errors
   * @param key
   */
  async deleteModel(key: PrimaryKey): Promise<void> {
    await this.database.transaction(async (tx) => {
      // /////////////////////////////////////
      // Delete Relation
      // /////////////////////////////////////
      const modelsService = new ModelsService({ database: tx, schema: this.schema });
      const model = await modelsService.readOne(key);

      const fieldsService = new FieldsService({ database: tx, schema: this.schema });
      const fieldIds = await fieldsService
        .readMany({
          filter: { model: { _eq: model.model } },
        })
        .then((fields) => fields.map((field) => field.id));

      await fieldsService.deleteMany(fieldIds);

      const permissionsService = new PermissionsService({
        database: tx,
        schema: this.schema,
      });

      const permissions = await permissionsService.readMany({
        filter: { model: { _eq: model.model } },
      });
      const ids = permissions.map((permission) => permission.id);
      await permissionsService.deleteMany(ids);

      // Delete many relation fields
      const relationsService = new RelationsService({ database: tx, schema: this.schema });

      const oneRelations = await relationsService.readMany({
        filter: { one_model: { _eq: model.model } },
      });

      for (let relation of oneRelations) {
        await fieldsService.executeFieldDelete(tx, relation.many_model, relation.many_field);
      }

      // Delete one relation fields
      const manyRelations = await relationsService.readMany({
        filter: { many_model: { _eq: model.model } },
      });

      for (let relation of manyRelations) {
        await fieldsService.executeFieldDelete(tx, relation.one_model, relation.one_field);
      }

      // Delete relations
      const relationIds = [...oneRelations, ...manyRelations]
        .filter((relation) => relation.id)
        .map((relation) => relation.id);

      await relationsService.deleteMany(relationIds);

      // /////////////////////////////////////
      // Delete Model
      // /////////////////////////////////////
      await modelsService.deleteOne(key);
      await tx.schema.dropTable(model.model);
    });
  }

  /**
   * @description Build fields array
   * @param modelId
   * @param data
   * @param hasStatus
   * @returns fields array
   */
  private buildFields = (
    modelId: PrimaryKey,
    data: Omit<Model, 'id'>,
    hasStatus: boolean
  ): Omit<Field, 'id'>[] => {
    const fields: Omit<Field, 'id'>[] = [
      {
        model: data.model,
        model_id: modelId,
        field: 'id',
        label: 'id',
        interface: 'input',
        required: true,
        readonly: true,
        hidden: true,
        special: null,
        sort: 0,
        options: null,
      },
      {
        model: data.model,
        model_id: modelId,
        field: 'created_at',
        label: 'Created At',
        interface: 'dateTime',
        required: true,
        readonly: true,
        hidden: true,
        special: null,
        sort: null,
        options: null,
      },
      {
        model: data.model,
        model_id: modelId,
        field: 'updated_at',
        label: 'Updated At',
        interface: 'dateTime',
        required: true,
        readonly: true,
        hidden: true,
        special: null,
        sort: null,
        options: null,
      },
    ];

    if (hasStatus) {
      fields.push({
        model: data.model,
        model_id: modelId,
        field: 'status',
        label: 'Status',
        interface: 'selectDropdownStatus',
        required: true,
        readonly: false,
        hidden: false,
        special: null,
        sort: null,
        options: JSON.stringify({
          choices: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
        }),
      });
    }

    return fields;
  };

  private async checkUniqueModel(model: string) {
    // TODO add to applyFilter
    const models = await this.database
      .select('id')
      .from('CollectionsModels')
      .whereRaw('LOWER(??) = ?', ['model', model.toLowerCase()]);

    if (models.length) {
      throw new RecordNotUniqueException('already_registered_model');
    }
  }
}
