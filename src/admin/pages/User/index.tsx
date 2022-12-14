import Table from '@admin/components/elements/Table';
import { Box } from '@mui/material';
import React from 'react';
import buildColumns from './buildColumns';

const User = () => {
  const columns = buildColumns();
  const rows = [
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Henderson',
      email: 'alice@example.com',
      role: 'Admin',
      userName: 'alice',
      status: 'Active',
      createdAt: '1670637496808',
    },
    {
      id: '2',
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
