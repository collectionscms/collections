import Table from '@admin/components/elements/Table';
import Cell, { Type } from '@admin/components/elements/Table/Cell';
import buildColumns from '@admin/utilities/buildColumns';
import { Box } from '@mui/material';
import React from 'react';

const fields = [
  { field: 'name', label: 'Name', type: Type.Text },
  { field: 'email', label: 'Email', type: Type.Text },
  { field: 'role', label: 'Role', type: Type.Text },
  { field: 'userName', label: 'User Name', type: Type.Text },
  { field: 'status', label: 'Status', type: Type.Text },
  { field: 'createdAt', label: 'Created At', type: Type.Date },
];

const columns = buildColumns(fields, (i: number, row: any, data: any) =>
  fields[i].field == 'name' ? (
    <Cell
      colIndex={i}
      type={fields[i].type}
      rowData={row}
      cellData={`${row.lastName} ${row.firstName}`}
    />
  ) : (
    <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
  )
);

const User = () => {
  const rows = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Henderson',
      email: 'alice@example.com',
      role: 'Admin',
      userName: 'alice',
      status: 'Active',
      createdAt: '1670637496808',
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Sanders',
      email: 'bob@example.com',
      role: 'Editor',
      userName: 'bob',
      status: 'Invited',
      createdAt: '1670637496808',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Table columns={columns} rows={rows} />
    </Box>
  );
};

export default User;
