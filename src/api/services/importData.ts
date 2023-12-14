import { parseFromFile } from '@collectionscms/plugin-wp-importer';
import { Knex } from 'knex';
import { UnsupportedMediaTypeException } from '../../exceptions/unsupportedMediaType.js';
import { getDatabase } from '../database/connection.js';
import { SchemaOverview, getSchemaOverview } from '../database/overview.js';
import { PrimaryKey } from '../database/schemas.js';
import { AbstractServiceOptions } from './base.js';
import { ContentsService } from './contents.js';
import { FieldsService } from './fields.js';
import { ModelsService } from './models.js';

export class ImportDataService {
  database: Knex;
  schema: SchemaOverview;

  constructor(options: AbstractServiceOptions) {
    this.schema = options.schema;
    this.database = options.database || getDatabase();
  }

  /**
   * @description Import data from buffer
   * @param mimetype
   * @param buffer
   * @returns
   */
  async importData(mimetype: string, buffer: Buffer): Promise<void> {
    switch (mimetype) {
      case 'text/xml':
        return await this.importXml(buffer);
      default:
        throw new UnsupportedMediaTypeException();
    }
  }

  private async importXml(buffer: Buffer): Promise<void> {
    const service = new ModelsService({ database: this.database, schema: this.schema });
    const models = await service.readMany({
      filter: {
        _and: [
          { model: { _in: ['Posts', 'Categories', 'Tags'] } },
          { source: { _eq: 'wordpress' } },
        ],
      },
    });

    const modelIds = models.reduce(
      (acc, model) => {
        acc[model.model] = model.id;
        return acc;
      },
      {} as Record<string, PrimaryKey>
    );

    // /////////////////////////////////////
    // Create fixed data
    // /////////////////////////////////////

    const modelKeys = await this.createModels(modelIds);
    await this.createFields(modelKeys, modelIds);

    // /////////////////////////////////////
    // Create contents from file
    // /////////////////////////////////////

    await service.database.transaction(async (tx) => {
      const result = await parseFromFile(buffer.toString());
      const schema = await getSchemaOverview({ database: tx });
      await this.createContents('Categories', tx, schema, result.categories);
      await this.createContents('Tags', tx, schema, result.tags);
      await this.createContents('Posts', tx, schema, result.posts);
    });
  }

  private async createModels(
    registeredModelIds: Record<string, PrimaryKey>
  ): Promise<Record<string, PrimaryKey>> {
    const models = [
      { model: 'Categories', hasStatus: false },
      { model: 'Tags', hasStatus: false },
      { model: 'Posts', hasStatus: true },
    ];

    const result: Record<string, PrimaryKey> = {};

    for (const { model, hasStatus } of models) {
      if (registeredModelIds[model]) {
        result[model] = registeredModelIds[model];
      } else {
        const modelsService = new ModelsService({ database: this.database, schema: this.schema });
        const modelId = await modelsService.createModel(
          {
            model: model,
            singleton: false,
            hidden: false,
            statusField: null,
            draftValue: null,
            publishValue: null,
            archiveValue: null,
            source: 'wordpress',
          },
          hasStatus
        );

        result[model] = modelId;
      }
    }

    return result;
  }

  private async createFields(
    modelKeys: Record<string, PrimaryKey>,
    registeredModels: Record<string, PrimaryKey>
  ): Promise<void> {
    const fieldsService = new FieldsService({ database: this.database, schema: this.schema });

    // /////////////////////////////////////
    // Categories
    // /////////////////////////////////////

    if (!registeredModels['Categories']) {
      // field
      await this.createFieldsForModel(fieldsService, 'Categories', modelKeys, [
        { field: 'name', label: 'Name', interface: 'input' },
        { field: 'slug', label: 'Slug', interface: 'input' },
      ]);

      // relational fields
      await this.createRelationalFieldsForModel(fieldsService, 'Categories', modelKeys);
    }

    // /////////////////////////////////////
    // Tags
    // /////////////////////////////////////

    if (!registeredModels['Tags']) {
      // fields
      await this.createFieldsForModel(fieldsService, 'Tags', modelKeys, [
        { field: 'name', label: 'Name', interface: 'input' },
        { field: 'slug', label: 'Slug', interface: 'input' },
      ]);

      // relational fields
      await this.createRelationalFieldsForModel(fieldsService, 'Tags', modelKeys);
    }

    // /////////////////////////////////////
    // Posts
    // /////////////////////////////////////

    if (!registeredModels['Posts']) {
      // fields
      await this.createFieldsForModel(fieldsService, 'Posts', modelKeys, [
        { field: 'title', label: 'Title', interface: 'input' },
        { field: 'content', label: 'Content', interface: 'inputRichTextMd' },
        { field: 'slug', label: 'Slug', interface: 'input' },
        { field: 'publishedDate', label: 'publishedDate', interface: 'dateTime' },
        { field: 'isPage', label: 'isPage', interface: 'boolean' },
      ]);
    }
  }

  private async createFieldsForModel(
    service: FieldsService,
    model: string,
    modelKeys: Record<string, PrimaryKey>,
    fields: { field: string; label: string; interface: string }[]
  ) {
    let sort = 0;
    for (const field of fields) {
      const newField = {
        model,
        modelId: modelKeys[model],
        ...field,
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: sort,
      };

      await service.createField(newField);
      sort++;
    }
  }

  private async createRelationalFieldsForModel(
    service: FieldsService,
    manyModel: string,
    modelKeys: Record<string, PrimaryKey>
  ) {
    const field = manyModel.toLowerCase();

    await service.createRelationalFields(
      {
        manyModel: manyModel,
        manyModelId: modelKeys[manyModel],
        manyField: 'postId',
        oneModel: 'Posts',
        oneModelId: modelKeys['Posts'],
        oneField: field,
      },
      [
        {
          model: 'Posts',
          modelId: modelKeys['Posts'],
          field: field,
          label: manyModel,
          interface: 'listOneToMany',
          readonly: false,
          required: false,
          hidden: false,
          special: null,
          options: null,
          sort: 10,
        },
        {
          model: manyModel,
          modelId: modelKeys[manyModel],
          field: 'postId',
          label: 'Post Id',
          interface: 'selectDropdownManyToOne',
          readonly: false,
          required: false,
          hidden: true,
          special: null,
          options: null,
          sort: 11,
        },
      ]
    );
  }

  private async createContents(
    model: string,
    tx: Knex.Transaction,
    schema: SchemaOverview,
    items: Record<string, any>[]
  ): Promise<void> {
    const filesOverview = schema.models[model].fields;
    const service = new ContentsService(model, { database: tx, schema: schema });
    for (const item of items) {
      delete item.id;
      item.id = await service.createContent(item, Object.values(filesOverview));
    }
  }
}
