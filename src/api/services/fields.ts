import { Knex } from 'knex';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { Field, PrimaryKey, Relation } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';
import { CollectionsService } from './collections.js';
import { RelationsService } from './relations.js';

export class FieldsService extends BaseService<Field> {
  constructor(options: AbstractServiceOptions) {
    super('superfast_fields', options);
  }

  /**
   * @description Get fields
   * Chaining orderBy is a workaround for the knex bug.
   * see: https://github.com/knex/knex/issues/5135#issuecomment-1160936433
   * @param collection
   * @returns fields
   */
  async getFields(collection: string): Promise<Field[]> {
    const fields = await this.readMany(
      {
        filter: { collection: { _eq: collection } },
      },
      [
        { column: 'sort', order: 'asc', nulls: 'last' },
        { column: 'sort', order: 'asc' },
      ]
    );
    return fields;
  }

  /**
   * @description Create a new field
   * @param data
   * @returns field
   */
  async createField(data: Omit<Field, 'id'>): Promise<Field> {
    await this.checkUniqueField(data.collection, data.field);

    const field = this.database.transaction(async (tx) => {
      const service = new FieldsService({ database: tx, schema: this.schema });

      if (data.interface) {
        const flag = this.helpers.date.fieldFlagForField(data.interface);
        if (flag) {
          data.special = flag;
        }
      }

      const key = await service.createOne(data);
      const field = await service.readOne(key);

      await tx.schema.alterTable(field.collection, (table) => {
        this.addColumnToTable(field, table);
      });

      return field;
    });

    return field;
  }

  /**
   * @description Update a field
   * @param key
   * @param data
   */
  async updateField(key: PrimaryKey, data: Omit<Field, 'id'>): Promise<void> {
    await this.database.transaction(async (tx) => {
      const service = new FieldsService({ database: tx, schema: this.schema });
      await service.updateOne(key, data);

      if (data.options) {
        const field = await service.readOne(key);
        await tx.schema.alterTable(field.collection, (table: Knex.CreateTableBuilder) => {
          this.addColumnToTable(field, table, true);
        });
      }
    });
  }

  /**
   * @description Create relational fields
   * @param relationalData
   * @param fieldData
   * @returns fields
   */
  async createRelationalFields(
    relationalData: Omit<Relation, 'id'>,
    fieldData: Omit<Field, 'id'>[]
  ): Promise<Field[]> {
    const fields = await this.database.transaction(async (tx) => {
      const relationsService = new RelationsService({ database: tx, schema: this.schema });
      const relationId = await relationsService.createOne(relationalData);
      const relation = await relationsService.readOne(relationId);

      const fieldsService = new FieldsService({ database: tx, schema: this.schema });
      var fields: Field[] = [];

      for (const data of fieldData) {
        const fieldId = await fieldsService.createOne(data);
        const field = await fieldsService.readOne(fieldId);

        fields.push(field as Field);

        await tx.schema.alterTable(field.collection, (table) => {
          this.addColumnToTable(field, table)?.references('id').inTable(relation.one_collection);
        });
      }

      return fields;
    });

    return fields;
  }

  /**
   * @description Delete field and related fields
   * @param key
   */
  async deleteField(key: PrimaryKey): Promise<void> {
    const field = await this.readOne(key);

    const collectionsService = new CollectionsService({
      database: this.database,
      schema: this.schema,
    });
    const collection = await collectionsService
      .readMany({
        filter: {
          collection: { _eq: field.collection },
        },
      })
      .then((data) => data[0]);

    await this.database.transaction(async (tx) => {
      // /////////////////////////////////////
      // Delete Relation
      // /////////////////////////////////////
      const fieldsService = new FieldsService({ database: tx, schema: this.schema });
      await fieldsService.deleteOne(key);

      if (collection.status_field === field.field) {
        const collectionsService = new CollectionsService({ database: tx, schema: this.schema });
        await collectionsService.updateOne(collection.id, { status_field: null });
      }

      // Delete many relation fields
      const relationsService = new RelationsService({ database: tx, schema: this.schema });
      const oneRelations = await relationsService.readMany({
        filter: {
          _and: [
            { one_collection: { _eq: field.collection } },
            { one_field: { _eq: field.field } },
          ],
        },
      });

      for (let relation of oneRelations) {
        await this.executeFieldDelete(tx, relation.many_collection, relation.many_field);
      }

      // Delete one relation fields
      const manyRelations = await relationsService.readMany({
        filter: {
          _and: [
            { many_collection: { _eq: field.collection } },
            { many_field: { _eq: field.field } },
          ],
        },
      });

      for (let relation of manyRelations) {
        await this.executeFieldDelete(tx, relation.one_collection, relation.one_field);
      }

      // Delete relations schema
      const relationIds = [...oneRelations, ...manyRelations]
        .filter((relation) => relation.id)
        .map((relation) => relation.id);

      await relationsService.deleteMany(relationIds);

      // /////////////////////////////////////
      // Delete Field
      // /////////////////////////////////////
      await this.executeFieldDelete(tx, collection.collection, field.field);
    });
  }

  /**
   * @description Delete meta and entity fields.
   * @param fieldsService
   * @param collection
   * @param field
   */
  async executeFieldDelete(tx: Knex.Transaction, collection: string, field: string) {
    // /////////////////////////////////////
    // Delete Entity
    // /////////////////////////////////////
    const hasEntity = !this.schema.collections[collection].fields[field].alias;
    const existingRelation = this.schema.relations.find(
      (existingRelation) =>
        (existingRelation.collection === collection && existingRelation.field === field) ||
        (existingRelation.relatedCollection === collection &&
          existingRelation.relatedField === field)
    );

    const service = new FieldsService({ database: tx, schema: this.schema });

    if (hasEntity) {
      await service.database.schema.table(collection, (table) => {
        // If the FK already exists in the DB, drop it first
        if (existingRelation !== undefined) table.dropForeign(field);
        table.dropColumn(field);
      });
    }

    // /////////////////////////////////////
    // Delete Meta
    // /////////////////////////////////////
    const fieldIds = await service
      .readMany({
        filter: {
          _and: [{ collection: { _eq: collection } }, { field: { _eq: field } }],
        },
      })
      .then((fields) => fields.map((field) => field.id));

    if (fieldIds.length > 0) {
      await service.deleteMany(fieldIds);
    }
  }

  private async checkUniqueField(collection: string, field: string) {
    const fields = await this.readMany({
      filter: {
        _and: [{ collection: { _eq: collection } }, { field: { _eq: field } }],
      },
    });

    if (fields.length) {
      throw new RecordNotUniqueException('already_registered_name');
    }
  }

  private addColumnToTable = (
    field: { interface: string | null; field: string; options: string | null },
    table: Knex.CreateTableBuilder,
    alter: boolean = false
  ) => {
    let column = null;

    switch (field.interface) {
      case 'input':
        column = table.string(field.field, 255);
        break;
      case 'selectDropdown':
      case 'selectDropdownStatus':
        column = table.string(field.field, 255).defaultTo('');
        break;
      case 'inputMultiline':
      case 'inputRichTextMd':
        column = table.text(field.field);
        break;
      case 'boolean': {
        const value = field.options ? JSON.parse(field.options) : null;
        column = table.boolean(field.field).defaultTo(value?.defaultValue || false);
        break;
      }
      case 'dateTime':
        column = table.timestamp(field.field);
        break;
      case 'fileImage':
        column = table
          .integer(field.field)
          .unsigned()
          .index()
          .references('id')
          .inTable('superfast_files');
        break;
      case 'listOneToMany':
        // noop
        break;
      case 'selectDropdownManyToOne':
        column = table.integer(field.field).unsigned().index();
        break;
      default:
        throw new InvalidPayloadException('unexpected_field_type_specified');
    }

    if (column && alter) {
      column.alter();
    }

    return column;
  };
}
