import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MinimalLayout: React.FC = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="row"
      sx={{ minHeight: '100vh' }}
    >
      <Outlet />
    </Grid>
  );
};

export default MinimalLayout;
