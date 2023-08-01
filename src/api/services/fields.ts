import { Knex } from 'knex';
import { Field } from '../../config/types.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { FieldsRepository } from '../repositories/fields.js';

export class FieldsService {
  repository: FieldsRepository;

  constructor(repository: FieldsRepository) {
    this.repository = repository;
  }

  /**
   * Creates a new field in the database and adds a corresponding column to the collection's table.
   * @param data
   * @returns
   */
  async createField(data: Omit<Field, 'id'>): Promise<Field> {
    const field = await this.repository.transaction(async (tx) => {
      const fieldId = await this.repository.transacting(tx).create(data);
      const field = await this.repository.transacting(tx).readOne(fieldId);
      await tx.transaction.schema.alterTable(field.collection, (table) => {
        addColumnToTable(field, table);
      });
      return field;
    });

    return field;
  }
}

export const addColumnToTable = (
  field: { interface: string; field: string; options: string | null },
  table: Knex.CreateTableBuilder,
  alter: boolean = false
) => {
  let column = null;

  switch (field.interface) {
    case 'input':
      column = table.string(field.field, 255);
      break;
    case 'selectDropdown':
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
      column = table.dateTime(field.field);
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
