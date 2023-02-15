import DeleteHeaderButton from '@admin/components/elements/DeleteHeaderButton';
import RouterLink from '@admin/components/elements/Link';
import { useAuth } from '@admin/components/utilities/Auth';
import { Button, Drawer, Stack, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ApiPreview from '../ApiPreview';
import { Props } from './types';

const EditPage: React.FC<Props> = ({ collection }) => {
  const { id } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleDeletionSuccess = () => {
    navigate(`/admin/collections/${collection.collection}`);
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
          <Grid xs={12} sm>
            <h1>
              {id ? 'Update' : 'Create'} {collection.collection}
            </h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            {id ? (
              <>
                <Grid>
                  <DeleteHeaderButton
                    id={id}
                    slug={`collections/${collection.collection}`}
                    disabled={!hasPermission(collection.collection, 'delete')}
                    onSuccess={handleDeletionSuccess}
                  />
                </Grid>
                <Grid>
                  <Button variant="contained" onClick={toggleDrawer(true)}>
                    {t('api_preview')}
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    variant="contained"
                    disabled={!hasPermission(collection.collection, 'update')}
                    component={RouterLink}
                    to={`../${collection.collection}`}
                  >
                    {t('update')}
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={`../${collection.collection}`}
                >
                  {t('create_new')}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default EditPage;
