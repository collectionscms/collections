import { Knex } from 'knex';
import { parseFromFile } from '@collectionscms/plugin-wp-importer';
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
      throw new RecordNotUniqueException('already_registered_model');
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

      await this.createContents('categories', tx, schema, result.categories);
      await this.createContents('tags', tx, schema, result.tags);
      await this.createContents('posts', tx, schema, result.posts);
    });
  }

  private async createModels(tx: Knex.Transaction): Promise<Record<string, PrimaryKey>> {
    const models = [
      { model: 'categories', hasStatus: false },
      { model: 'tags', hasStatus: false },
      { model: 'posts', hasStatus: true },
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
          source: 'wordpress',
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
        model: 'categories',
        model_id: modelKeys['categories'],
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
        model: 'categories',
        model_id: modelKeys['categories'],
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
        model: 'tags',
        model_id: modelKeys['tags'],
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
        model: 'tags',
        model_id: modelKeys['tags'],
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
        model: 'posts',
        model_id: modelKeys['posts'],
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
        model: 'posts',
        model_id: modelKeys['posts'],
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
        model: 'posts',
        model_id: modelKeys['posts'],
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
        model: 'posts',
        model_id: modelKeys['posts'],
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
        model: 'posts',
        model_id: modelKeys['posts'],
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
        many_model: 'categories',
        many_model_id: modelKeys['categories'],
        many_field: 'post_id',
        one_model: 'posts',
        one_model_id: modelKeys['posts'],
        one_field: 'categories',
      },
      [
        {
          model: 'posts',
          model_id: modelKeys['posts'],
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
          model: 'categories',
          model_id: modelKeys['categories'],
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
        many_model: 'tags',
        many_model_id: modelKeys['tags'],
        many_field: 'post_id',
        one_model: 'posts',
        one_model_id: modelKeys['posts'],
        one_field: 'tags',
      },
      [
        {
          model: 'posts',
          model_id: modelKeys['posts'],
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
          model: 'tags',
          model_id: modelKeys['tags'],
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
