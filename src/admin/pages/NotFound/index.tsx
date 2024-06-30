import { Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', overflow: 'hidden' }}
    >
      <Grid xs={12}>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Typography variant="h1">Nothing found</Typography>
          <Typography color="textSecondary" align="center" sx={{ width: { xs: '73%', sm: '61%' } }}>
            {t('not_found')}
          </Typography>
          <Button component={RouterLink} to="/admin" variant="contained">
            {t('back_to_home')}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};
