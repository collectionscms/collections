export enum FieldType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  Object = 'object',
  Boolean = 'boolean',
  Array = 'array',
}

export type Props = {
  colIndex: number;
  type: CellType;
  cellData: unknown;
};

export type CellType = {
  fieldType: FieldType;
};

export const cells: Record<FieldType, () => CellType> = {
  text: () => ({ fieldType: FieldType.Text }),
  number: () => ({ fieldType: FieldType.Number }),
  date: () => ({ fieldType: FieldType.Date }),
  object: () => ({ fieldType: FieldType.Object }),
  boolean: () => ({ fieldType: FieldType.Boolean }),
  array: () => ({ fieldType: FieldType.Array }),
};
