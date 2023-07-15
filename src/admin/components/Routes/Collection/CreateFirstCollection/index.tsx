import { Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

export const CreateFirstCollection: React.FC = () => {
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
          <Typography variant="h2">{t('register_content_type')}</Typography>
          <Typography color="textSecondary" align="center" sx={{ width: { xs: '73%', sm: '61%' } }}>
            {t('create_first_content_type')}
          </Typography>
          <Button component={RouterLink} to="/admin/settings/content-types" variant="contained">
            {t('go_to_registration')}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};
