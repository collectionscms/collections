import { Grid, Typography } from '@mui/material';
import React from 'react';
import { MainCard } from '../MainCard/index.js';

type Props = {
  title: string;
};

export const HeaderBar: React.FC<Props> = ({ title }) => {
  return (
    <MainCard shadow="none" sx={{ mb: 3, bgcolor: 'transparent' }} border={false} content={false}>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
      >
        <Grid item sx={{ mt: 0.25 }}>
          <Typography variant="h2">{title}</Typography>
        </Grid>
      </Grid>
    </MainCard>
  );
};
