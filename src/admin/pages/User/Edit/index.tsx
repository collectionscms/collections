import RouterLink from '@admin/components/elements/Link';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export type OnChange<T = string> = (value: T) => void;

const EditPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{id ? 'Edit' : 'Create'} User</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained" component={RouterLink} to="../content-types/1">
              {id ? t('button.update') : t('button.create')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default EditPage;
