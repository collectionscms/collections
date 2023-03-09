import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CollectionNotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{t('content_management')}</h1>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="row"
        sx={{ minHeight: '40vh' }}
      >
        <h2>{t('collection_not_found')}</h2>
      </Grid>
    </Stack>
  );
};

export default CollectionNotFound;
