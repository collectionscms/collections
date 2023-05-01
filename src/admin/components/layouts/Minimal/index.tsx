import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const MinimalLayout: React.FC = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="row"
      sx={{ minHeight: '100vh' }}
    >
      <Stack spacing={4} sx={{ width: '500px', px: { xs: 2 } }}>
        <Outlet />
      </Stack>
    </Grid>
  );
};
