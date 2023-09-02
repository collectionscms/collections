import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { Collection, Field, PrimaryKey } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';
import { FieldsService } from './fields.js';
import { PermissionsService } from './permissions.js';
import { RelationsService } from './relations.js';

export class CollectionsService extends BaseService<Collection> {
  constructor(options: AbstractServiceOptions) {
    super('superfast_collections', options);
  }

  /**
   * @description Create collection with system fields
   * @param data
   * @param status
   * @returns primary key
   */
  async createCollection(data: Omit<Collection, 'id'>, status: boolean): Promise<PrimaryKey> {
    await this.checkUniqueCollection(data.collection);

    const fullData: Omit<Collection, 'id'> = status
      ? {
          ...data,
          status_field: 'status',
          draft_value: 'draft',
          publish_value: 'published',
          archive_value: 'archived',
        }
      : data;

    const collectionId = await this.database.transaction(async (tx) => {
      const collectionsService = new CollectionsService({ database: tx, schema: this.schema });
      const collectionId = await collectionsService.createOne(fullData);

      await tx.schema.createTable(data.collection, (table) => {
        table.increments();
        table.timestamps(true, true);
        status && table.string('status').notNullable();
      });

      const fieldsService = new FieldsService({ database: tx, schema: this.schema });
      const fields = this.buildFields(data, status || false);
      await fieldsService.createMany(fields);

      return collectionId;
    });

    return collectionId;
  }

  /**
   * @description Update a collection
   * @param key
   * @param data
   */
  async updateCollection(key: PrimaryKey, data: Omit<Collection, 'id'>): Promise<void> {
    await this.database.transaction(async (tx) => {
      const service = new CollectionsService({ database: tx, schema: this.schema });
      await service.updateOne(key, data);

      if (data.status_field) {
        const collection = await service.readOne(key);

        const fieldsService = new FieldsService({ database: tx, schema: this.schema });
        const fields = await fieldsService.readMany({
          filter: {
            _and: [
              { collection: { _eq: collection.collection } },
              { field: { _eq: data.status_field } },
            ],
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
   * @description Delete a collection
   * Execute in order of relation -> entity to avoid DB constraint errors
   * @param key
   */
  async deleteCollection(key: PrimaryKey): Promise<void> {
    await this.database.transaction(async (tx) => {
      // /////////////////////////////////////
      // Delete Relation
      // /////////////////////////////////////
      const collectionsService = new CollectionsService({ database: tx, schema: this.schema });
      const collection = await collectionsService.readOne(key);

      await collectionsService.deleteOne(key);

      const fieldsService = new FieldsService({ database: tx, schema: this.schema });
      const fieldIds = await fieldsService
        .readMany({
          filter: { collection: { _eq: collection.collection } },
        })
        .then((fields) => fields.map((field) => field.id));

      await fieldsService.deleteMany(fieldIds);

      const permissionsService = new PermissionsService({
        database: tx,
        schema: this.schema,
      });

      const permissions = await permissionsService.readMany({
        filter: { collection: { _eq: collection.collection } },
      });
      const ids = permissions.map((permission) => permission.id);
      await permissionsService.deleteMany(ids);

      // Delete many relation fields
      const relationsService = new RelationsService({ database: tx, schema: this.schema });

      const oneRelations = await relationsService.readMany({
        filter: { one_collection: { _eq: collection.collection } },
      });

      for (let relation of oneRelations) {
        await fieldsService.executeFieldDelete(tx, relation.many_collection, relation.many_field);
      }

      // Delete one relation fields
      const manyRelations = await relationsService.readMany({
        filter: { many_collection: { _eq: collection.collection } },
      });

      for (let relation of manyRelations) {
        await fieldsService.executeFieldDelete(tx, relation.one_collection, relation.one_field);
      }

      // Delete relations
      const relationIds = [...oneRelations, ...manyRelations]
        .filter((relation) => relation.id)
        .map((relation) => relation.id);

      await relationsService.deleteMany(relationIds);

      // /////////////////////////////////////
      // Delete Entity
      // /////////////////////////////////////
      await tx.schema.dropTable(collection.collection);
    });
  }

  /**
   * @description Build fields array
   * @param data
   * @param hasStatus
   * @returns fields array
   */
  private buildFields = (data: Omit<Collection, 'id'>, hasStatus: boolean): Omit<Field, 'id'>[] => {
    const fields: Omit<Field, 'id'>[] = [
      {
        collection: data.collection,
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
        collection: data.collection,
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
        collection: data.collection,
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
        collection: data.collection,
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

  private async checkUniqueCollection(collection: string) {
    const collections = await this.readMany({
      filter: { collection: { _eq: collection } },
    });

    if (collections.length) {
      throw new RecordNotUniqueException('already_registered_name');
    }
  }
}
