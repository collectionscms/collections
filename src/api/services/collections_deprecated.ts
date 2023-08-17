import { Collection } from '../../config/types.js';
import { Collection as CollectionSchema, Field } from '../database/schemas.js';
import { CollectionsRepository } from '../repositories/collections.js';
import { FieldsRepository } from '../repositories/fields.js';

export class CollectionsService {
  repository: CollectionsRepository;
  fieldsRepository: FieldsRepository;

  constructor(repository: CollectionsRepository, fieldsRepository: FieldsRepository) {
    this.repository = repository;
    this.fieldsRepository = fieldsRepository;
  }

  /**
   * @description create collection with fields
   * @param data
   * @returns collection id
   */
  async createCollection(data: Omit<Collection, 'id'>): Promise<number> {
    const { ['status']: _, ...removedStatusData } = data;
    const fullData: Omit<CollectionSchema, 'id'> = data.status
      ? {
          ...removedStatusData,
          status_field: 'status',
          draft_value: 'draft',
          publish_value: 'published',
          archive_value: 'archived',
        }
      : removedStatusData;

    const collectionId = await this.repository.transaction(async (tx) => {
      const collectionId = await this.repository.transacting(tx).create(fullData);

      await tx.transaction.schema.createTable(data.collection, (table) => {
        table.increments();
        table.timestamps(true, true);
        data.status && table.string('status').notNullable();
      });

      const fields = this.buildFields(data, data.status || false);
      await this.fieldsRepository.transacting(tx).createMany(fields);

      return collectionId;
    });

    return collectionId;
  }

  /**
   * @description build fields array
   * @param data
   * @param hasStatus
   * @returns fields array
   */
  private buildFields = (
    data: Omit<CollectionSchema, 'id'>,
    hasStatus: boolean
  ): Omit<Field, 'id'>[] => {
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
}
