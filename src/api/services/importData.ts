import { Knex } from 'knex';
import { parseFromFile } from 'plugin-wp-importer';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { UnsupportedMediaTypeException } from '../../exceptions/unsupportedMediaType.js';
import { getDatabase } from '../database/connection.js';
import { SchemaOverview, getSchemaOverview } from '../database/overview.js';
import { Field } from '../database/schemas.js';
import { AbstractServiceOptions } from './base.js';
import { CollectionsService } from './collections.js';
import { ContentsService } from './contents.js';
import { FieldsService } from './fields.js';

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
    const service = new CollectionsService({ database: this.database, schema: this.schema });
    const collections = await service.readMany({
      filter: {
        _or: [
          { collection: { _eq: 'posts' } },
          { collection: { _eq: 'categories' } },
          { collection: { _eq: 'tags' } },
        ],
      },
    });

    if (collections.length > 0) {
      throw new RecordNotUniqueException('already_registered_name');
    }

    await service.database.transaction(async (tx) => {
      // /////////////////////////////////////
      // Create fixed data
      // /////////////////////////////////////

      await this.createCollections(tx);
      await this.createFields(tx);

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

  private async createCollections(tx: Knex.Transaction): Promise<void> {
    const collections = [
      { collection: 'category', hasStatus: false },
      { collection: 'tag', hasStatus: false },
      { collection: 'post', hasStatus: true },
    ];

    const collectionsService = new CollectionsService({ database: tx, schema: this.schema });
    for (const { collection, hasStatus } of collections) {
      await collectionsService.createCollection(
        {
          collection,
          singleton: false,
          hidden: false,
          status_field: null,
          draft_value: null,
          publish_value: null,
          archive_value: null,
        },
        hasStatus
      );
    }
  }

  private async createFields(tx: Knex.Transaction): Promise<void> {
    const categoryFields: Omit<Field, 'id'>[] = [
      {
        collection: 'category',
        field: 'slug',
        label: 'Slug',
        interface: 'input',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 0,
      },
      {
        collection: 'category',
        field: 'name',
        label: 'Name',
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
        collection: 'tag',
        field: 'slug',
        label: 'Slug',
        interface: 'input',
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 0,
      },
      {
        collection: 'tag',
        field: 'name',
        label: 'Name',
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
        collection: 'post',
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
        collection: 'post',
        field: 'content',
        label: 'Content',
        interface: 'inputMultiline', // TODO: Change to 'inputRichTextHtml'
        readonly: false,
        required: false,
        hidden: false,
        special: null,
        options: null,
        sort: 1,
      },
      {
        collection: 'post',
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
        collection: 'post',
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
        collection: 'post',
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
        many_collection: 'category',
        many_field: 'post_id',
        one_collection: 'post',
        one_field: 'categories',
      },
      [
        {
          collection: 'post',
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
          collection: 'category',
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
        many_collection: 'tag',
        many_field: 'post_id',
        one_collection: 'post',
        one_field: 'tags',
      },
      [
        {
          collection: 'post',
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
          collection: 'tag',
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
    collection: string,
    tx: Knex.Transaction,
    schema: SchemaOverview,
    items: Record<string, any>[]
  ): Promise<void> {
    const filesOverview = schema.collections[collection].fields;
    const service = new ContentsService(collection, { database: tx, schema: schema });
    for (const item of items) {
      await service.createContent(item, Object.values(filesOverview));
    }
  }
}
