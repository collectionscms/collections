import Table from '@admin/components/elements/Table';
import Cell from '@admin/components/elements/Table/Cell';
import { Type } from '@admin/components/elements/Table/Cell/types';
import buildColumns from '@admin/utilities/buildColumns';
import { Box } from '@mui/material';
import React from 'react';

const fields = [
  { field: 'name', label: 'Name', type: Type.Text },
  { field: 'description', label: 'Description', type: Type.Text },
  { field: 'createdAt', label: 'Created At', type: Type.Date },
];

const columns = buildColumns(fields, (i: number, row: any, data: any) => (
  <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
));

const Role: React.FC = () => {
  const rows = [
    {
      id: 1,
      name: 'Admin',
      description: 'Super Admins can access and manage all features and settings.',
      createdAt: '1670637496808',
    },
    {
      id: 2,
      name: 'Editor',
      description: 'Editors can manage and publish contents including those of other users.',
      createdAt: '1670648096808',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Table columns={columns} rows={rows} />
    </Box>
  );
};

export default Role;
