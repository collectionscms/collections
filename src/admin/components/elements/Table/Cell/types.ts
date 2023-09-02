import { Choice } from '../../../../config/types.js';

export enum FieldType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  Object = 'object',
  Status = 'status',
  Boolean = 'boolean',
  Array = 'array',
}

export type Props = {
  colIndex: number;
  type: CellType;
  cellData: unknown;
};

export type StatusChoices = {
  [key: string]: { status: 'draft' | 'published' | 'archived'; choice: Choice };
};

export type CellType = {
  fieldType: FieldType;
  options?: {
    choices?: StatusChoices;
  };
};

export const cells: Record<FieldType, (options?: { choices?: StatusChoices }) => CellType> = {
  text: () => ({ fieldType: FieldType.Text }),
  number: () => ({ fieldType: FieldType.Number }),
  date: () => ({ fieldType: FieldType.Date }),
  object: () => ({ fieldType: FieldType.Object }),
  status: (options?: { choices?: StatusChoices }) => ({ fieldType: FieldType.Status, options }),
  boolean: () => ({ fieldType: FieldType.Boolean }),
  array: () => ({ fieldType: FieldType.Array }),
};
