import Cell from '@admin/components/elements/Table/Cell';
import { Type } from '@admin/components/elements/Table/Cell/types';
import { Column } from '@admin/components/elements/Table/types';
import React from 'react';

const buildColumns = (): Column[] => {
  const fields = [
    { accessor: 'name', label: 'Name', type: Type.Text },
    { accessor: 'email', label: 'Email', type: Type.Text },
    { accessor: 'role', label: 'Role', type: Type.Text },
    { accessor: 'userName', label: 'User Name', type: Type.Text },
    { accessor: 'status', label: 'Status', type: Type.Text },
    { accessor: 'createdAt', label: 'Created At', type: Type.Date },
  ];

  const columns: Column[] = fields.map((field, i) => ({
    accessor: field.accessor,
    label: field.label,
    renderCell: (row, data) =>
      field.accessor == 'name' ? (
        <Cell
          colIndex={i}
          type={field.type}
          rowData={row}
          cellData={`${row.lastName} ${row.firstName}`}
        />
      ) : (
        <Cell colIndex={i} type={field.type} rowData={row} cellData={data} />
      ),
  }));

  return columns;
};

export default buildColumns;
