import RouterLink from '@admin/components/elements/Link';
import { useAuth } from '@admin/components/utilities/Auth';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Props } from './types';

const EditPage: React.FC<Props> = ({ collection }) => {
  const { id } = useParams();
  const { hasPermission } = useAuth();

  return (
    <>
      <Stack rowGap={3}>
        <Grid container spacing={2}>
          <Grid xs>
            <h1>
              {id ? 'Update' : 'Create'} {collection.collection}
            </h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            <Grid>
              <Button
                variant="contained"
                disabled={!hasPermission(collection.collection, id ? 'update' : 'create')}
                component={RouterLink}
                to="create"
              >
                {id ? t('button.update') : t('button.create')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default EditPage;
