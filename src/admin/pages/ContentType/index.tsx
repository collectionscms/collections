import Table from '@admin/components/elements/Table';
import Cell, { Type } from '@admin/components/elements/Table/Cell';
import buildColumns from '@admin/utilities/buildColumns';
import { Box } from '@mui/material';
import { Field } from 'config/types';
import React from 'react';

const fields: Field[] = [{ field: 'name', label: 'Name', type: Type.Text }];

const columns = buildColumns(fields, (i: number, row: any, data: any) => (
  <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
));

const ContentType: React.FC = () => {
  const rows = [
    {
      id: 1,
      name: 'Restaurant',
    },
    {
      id: 2,
      name: 'Menu',
    },
    {
      id: 3,
      name: 'Owner',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Table columns={columns} rows={rows} />
    </Box>
  );
};

export default ContentType;
