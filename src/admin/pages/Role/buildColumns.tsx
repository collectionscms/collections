import Cell from '@admin/components/elements/Table/Cell';
import { Type } from '@admin/components/elements/Table/Cell/types';
import { Column } from '@admin/components/elements/Table/types';
import React from 'react';

const buildColumns = (): Column[] => {
  const fields = [
    { accessor: 'name', label: 'Name', type: Type.Text },
    { accessor: 'description', label: 'Description', type: Type.Text },
    { accessor: 'createdAt', label: 'Created At', type: Type.Date },
  ];

  const columns: Column[] = fields.map((field, i) => ({
    accessor: field.accessor,
    label: field.label,
    renderCell: (row, data) => (
      <Cell colIndex={i} type={field.type} rowData={row} cellData={data} />
    ),
  }));

  return columns;
};

export default buildColumns;
