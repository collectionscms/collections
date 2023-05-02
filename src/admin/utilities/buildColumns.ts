import { Column, ColumnField } from '../components/elements/Table/types.js';

export const buildColumns = (
  fields: ColumnField[],
  customRenderCell?: (index: number, row: any, data: any) => React.ReactNode
): Column[] => {
  return fields.map((meta) => ({
    field: meta,
    label: meta.label,
    customRenderCell,
  }));
};
