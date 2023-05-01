import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RouterLink } from '../../components/elements/Link/index.js';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="row"
      sx={{ minHeight: '100vh' }}
    >
      <Stack rowGap={3}>
        <h1>Nothing found</h1>
        <Button variant="outlined" size="large" component={RouterLink} to="/admin/collections">
          {t('back_to_home')}
        </Button>
      </Stack>
    </Grid>
  );
};
