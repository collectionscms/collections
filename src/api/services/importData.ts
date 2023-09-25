import { Knex } from 'knex';
import { parseFromFile } from 'plugin-wp-importer';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { UnsupportedMediaTypeException } from '../../exceptions/unsupportedMediaType.js';
import { getDatabase } from '../database/connection.js';
import { SchemaOverview, getSchemaOverview } from '../database/overview.js';
import { Field, PrimaryKey } from '../database/schemas.js';
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
    // TODO: case insensitive
    const service = new ModelsService({ database: this.database, schema: this.schema });
    const models = await service.readMany({
      filter: {
        _or: [
          { model: { _eq: 'posts' } },
          { model: { _eq: 'categories' } },
          { model: { _eq: 'tags' } },
        ],
      },
    });

    if (models.length > 0) {
      throw new RecordNotUniqueException('already_registered_name');
    }

    await service.database.transaction(async (tx) => {
      // /////////////////////////////////////
      // Create fixed data
      // /////////////////////////////////////

      const modelKeys = await this.createModels(tx);
      await this.createFields(tx, modelKeys);

      // /////////////////////////////////////
      // Create contents from file
      // /////////////////////////////////////

      const result = await parseFromFile(buffer.toString());
      const schema = await getSchemaOverview({ database: tx });

      await this.createContents('category', tx, schema, result.categories);
      await this.createContents('tag', tx, schema, result.tags);
      await this.createContents('post', tx, schema, result.posts);
    });
  }

  private async createModels(tx: Knex.Transaction): Promise<Record<string, PrimaryKey>> {
    const models = [
      { model: 'category', hasStatus: false },
      { model: 'tag', hasStatus: false },
      { model: 'post', hasStatus: true },
    ];

    const result: Record<string, PrimaryKey> = {};

    const modelsService = new ModelsService({ database: tx, schema: this.schema });
    for (const { model, hasStatus } of models) {
      const modelId = await modelsService.createModel(
        {
          model: model,
          singleton: false,
          hidden: false,
          status_field: null,
          draft_value: null,
          publish_value: null,
          archive_value: null,
        },
        hasStatus
      );

      result[model] = modelId;
    }

    return result;
  }

  private async createFields(
    tx: Knex.Transaction,
    modelKeys: Record<string, PrimaryKey>
  ): Promise<void> {
    const categoryFields: Omit<Field, 'id'>[] = [
      {
        model: 'category',
        model_id: modelKeys['category'],
        field: 'name',
        label: 'Name',
        interface: 'input',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 0,
      },
      {
        model: 'category',
        model_id: modelKeys['category'],
        field: 'slug',
        label: 'Slug',
        interface: 'input',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 1,
      },
    ];

    const tagFields: Omit<Field, 'id'>[] = [
      {
        model: 'tag',
        model_id: modelKeys['tag'],
        field: 'name',
        label: 'Name',
        interface: 'input',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 0,
      },
      {
        model: 'tag',
        model_id: modelKeys['tag'],
        field: 'slug',
        label: 'Slug',
        interface: 'input',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 1,
      },
    ];

    const postFields: Omit<Field, 'id'>[] = [
      {
        model: 'post',
        model_id: modelKeys['post'],
        field: 'title',
        label: 'Title',
        interface: 'input',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 0,
      },
      {
        model: 'post',
        model_id: modelKeys['post'],
        field: 'content',
        label: 'Content',
        interface: 'inputRichTextMd', // TODO: Change to 'inputRichTextHtml'
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 1,
      },
      {
        model: 'post',
        model_id: modelKeys['post'],
        field: 'slug',
        label: 'Slug',
        interface: 'input',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 2,
      },
      {
        model: 'post',
        model_id: modelKeys['post'],
        field: 'published_date',
        label: 'publishedDate',
        interface: 'dateTime',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 3,
      },
      {
        model: 'post',
        model_id: modelKeys['post'],
        field: 'is_page',
        label: 'isPage',
        interface: 'boolean',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 4,
      },
    ];

    const fieldsService = new FieldsService({ database: tx, schema: this.schema });

    // /////////////////////////////////////
    // Fields
    // /////////////////////////////////////

    for (const field of [...categoryFields, ...tagFields, ...postFields]) {
      await fieldsService.createField(field);
    }

    // /////////////////////////////////////
    // Relation Field - Categories
    // /////////////////////////////////////

    await fieldsService.createRelationalFields(
      {
        many_model: 'category',
        many_model_id: modelKeys['category'],
        many_field: 'post_id',
        one_model: 'post',
        one_model_id: modelKeys['post'],
        one_field: 'categories',
      },
      [
        {
          model: 'post',
          model_id: modelKeys['post'],
          field: 'categories',
          label: 'Categories',
          interface: 'listOneToMany',
          readonly: false,
          required: false,
          hidden: false,
          special: null,
          options: null,
          sort: 10,
        },
        {
          model: 'category',
          model_id: modelKeys['category'],
          field: 'post_id',
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

    // /////////////////////////////////////
    // Relation Field - Tags
    // /////////////////////////////////////

    await fieldsService.createRelationalFields(
      {
        many_model: 'tag',
        many_model_id: modelKeys['tag'],
        many_field: 'post_id',
        one_model: 'post',
        one_model_id: modelKeys['post'],
        one_field: 'tags',
      },
      [
        {
          model: 'post',
          model_id: modelKeys['post'],
          field: 'tags',
          label: 'Tags',
          interface: 'listOneToMany',
          readonly: false,
          required: false,
          hidden: false,
          special: null,
          options: null,
          sort: 10,
        },
        {
          model: 'tag',
          model_id: modelKeys['tag'],
          field: 'post_id',
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
      await service.createContent(item, Object.values(filesOverview));
    }
  }
}
