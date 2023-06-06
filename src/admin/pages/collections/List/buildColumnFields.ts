import { Type } from '../../../../admin/components/elements/Table/Cell/types.js';
import { ColumnField } from '../../../../admin/components/elements/Table/types.js';
import { Field } from '../../../../config/types.js';

export const buildColumnFields = (fields: Field[]): ColumnField[] => {
  return fields
    .filter((field) => !field.hidden)
    .map((field) => {
      return {
        field: field.field,
        label: field.label,
        type: toType(field.interface),
      };
    });
};

const toType = (fieldInterface: string): (typeof Type)[keyof typeof Type] => {
  switch (fieldInterface) {
    case 'input':
    case 'inputMultiline':
    case 'inputRichTextMd':
    case 'fileImage':
    case 'selectDropdown':
    case 'selectDropdownManyToOne':
      return Type.Text;
    case 'selectDropdownStatus':
      return Type.Status;
    case 'boolean':
      return Type.Boolean;
    case 'dateTime':
      return Type.Date;
    case 'listOneToMany':
      return Type.Array;
    default:
      return Type.Object;
  }
};
