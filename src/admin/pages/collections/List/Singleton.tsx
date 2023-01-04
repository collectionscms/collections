import RouterLink from '@admin/components/elements/Link';
import { Type } from '@admin/components/elements/Table/Cell/types';
import { Button, Drawer, FormLabel, Stack, TextField, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ApiPreview from '../ApiPreview';
import { Props } from './types';

const SingletonPage: React.FC<Props> = ({ collection }) => {
  const theme = useTheme();
  const { t } = useTranslation();
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

  // TODO Retrieve from DB
  const fields = [
    { field: 'name', label: 'Name', type: Type.Text },
    { field: 'address', label: 'Address', type: Type.Text },
  ];

  return (
    <Stack rowGap={3}>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        <ApiPreview path={collection.collection} />
      </Drawer>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{collection.collection}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained" onClick={toggleDrawer(true)}>
              {t('button.apiPreview')}
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              component={RouterLink}
              to={`/admin/collections/${collection}`}
            >
              {t('button.update')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} xs={12} xl={6}>
        {fields.map((field) => (
          <Grid xs={12} md={6} key={field.field}>
            <FormLabel>{field.label}</FormLabel> <TextField id={field.field} fullWidth />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default SingletonPage;
