import Table from '@admin/components/elements/Table';
import { Box } from '@mui/material';
import React from 'react';
import buildColumns from './buildColumns';

const Role: React.FC = () => {
  const columns = buildColumns();
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
