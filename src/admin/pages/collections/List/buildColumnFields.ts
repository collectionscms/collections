import {
  CellType,
  StatusChoices,
  cells,
} from '../../../../admin/components/elements/Table/Cell/types.js';
import { ColumnField } from '../../../../admin/components/elements/Table/types.js';
import { Collection, Field } from '../../../config/types.js';

export const buildColumnFields = (collection: Collection, fields: Field[]): ColumnField[] => {
  return fields
    .filter((field) => !field.hidden)
    .map((field) => {
      return {
        field: field.field,
        label: field.label,
        type: toType(collection, field),
      };
    });
};

const toType = (collection: Collection, field: Field): CellType => {
  switch (field.interface) {
    case 'input':
    case 'inputMultiline':
    case 'inputRichTextMd':
    case 'fileImage':
    case 'selectDropdown':
    case 'selectDropdownManyToOne':
      return cells.text();
    case 'selectDropdownStatus':
      const choices: StatusChoices = {};

      for (const choice of field.fieldOption?.choices || []) {
        if (choice.value === collection.draft_value) {
          choices[choice.value] = { status: 'draft', choice };
        } else if (choice.value === collection.publish_value) {
          choices[choice.value] = { status: 'published', choice };
        } else if (choice.value === collection.archive_value) {
          choices[choice.value] = { status: 'archived', choice };
        }
      }

      return cells.status({ choices });
    case 'boolean':
      return cells.boolean();
    case 'dateTime':
      return cells.date();
    case 'listOneToMany':
      return cells.array();
    default:
      return cells.object();
  }
};
