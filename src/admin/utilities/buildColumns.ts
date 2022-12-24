import { Column } from '@admin/components/elements/Table/types';
import { Field } from 'config/types';

const buildColumns = (
  fields: Field[],
  renderCell: (index: number, row: any, data: any) => React.ReactNode
): Column[] => {
  return fields.map((meta) => ({
    field: meta.field,
    label: meta.label,
    renderCell,
  }));
};

export default buildColumns;
