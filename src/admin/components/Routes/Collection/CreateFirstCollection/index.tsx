import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RouterLink from '../../../elements/Link';

const CreateFirstCollection: React.FC = () => {
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
        <Stack rowGap={3}>
          <h2>{t('register_content_type')}</h2>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/admin/settings/content-types"
          >
            {t('go_to_registration')}
          </Button>
        </Stack>
      </Grid>
    </Stack>
  );
};

export default CreateFirstCollection;
