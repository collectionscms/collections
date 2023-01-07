import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import Cell from '@admin/components/elements/Table/Cell';
import { Type } from '@admin/components/elements/Table/Cell/types';
import buildColumns from '@admin/utilities/buildColumns';
import { Button, Drawer, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import { t } from 'i18next';
import React, { useState } from 'react';
import ApiPreview from '../ApiPreview';
import { Props } from './types';

// TODO Retrieve from DB
const fields = [{ field: 'name', label: 'Name', type: Type.Text }];

const columns = buildColumns(fields, (i: number, row: any, data: any) => (
  <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
));

const DefaultListPage: React.FC<Props> = ({ collection }) => {
  const theme = useTheme();
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

  const rows = [
    {
      id: 1,
      name: 'collection1',
    },
    {
      id: 2,
      name: 'collection2',
    },
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
              {t('api_preview')}
            </Button>
          </Grid>
          <Grid>
            <Button variant="contained" component={RouterLink} to="create">
              {t('create_new')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Table columns={columns} rows={rows} />
    </Stack>
  );
};

export default DefaultListPage;
