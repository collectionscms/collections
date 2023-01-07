import RouterLink from '@admin/components/elements/Link';
import { useAuth } from '@admin/components/utilities/Auth';
import { Button, Drawer, Stack, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiPreview from '../ApiPreview';
import { Props } from './types';

const EditPage: React.FC<Props> = ({ collection }) => {
  const { id } = useParams();
  const theme = useTheme();
  const { hasPermission } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  return (
    <>
      <Stack rowGap={3}>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{ zIndex: theme.zIndex.appBar + 200 }}
        >
          <ApiPreview path={`${collection.collection}/${id}`} />
        </Drawer>
        <Grid container spacing={2}>
          <Grid xs>
            <h1>
              {id ? 'Update' : 'Create'} {collection.collection}
            </h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            {id && (
              <Grid>
                <Button variant="contained" onClick={toggleDrawer(true)}>
                  {t('api_preview')}
                </Button>
              </Grid>
            )}
            <Grid>
              <Button
                variant="contained"
                disabled={!hasPermission(collection.collection, id ? 'update' : 'create')}
                component={RouterLink}
                to="create"
              >
                {id ? t('update') : t('create_new')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default EditPage;
