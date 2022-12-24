import { Column } from '@admin/components/elements/Table/types';
import { Field } from 'config/types';

const buildColumns = (
  fields: Field[],
  customRenderCell?: (index: number, row: any, data: any) => React.ReactNode
): Column[] => {
  return fields.map((meta) => ({
    field: meta,
    label: meta.label,
    customRenderCell,
  }));
};

export default buildColumns;
