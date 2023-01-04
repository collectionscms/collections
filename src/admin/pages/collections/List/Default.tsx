import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import Cell from '@admin/components/elements/Table/Cell';
import { Type } from '@admin/components/elements/Table/Cell/types';
import buildColumns from '@admin/utilities/buildColumns';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import { t } from 'i18next';
import React from 'react';
import { Props } from './types';

// TODO Retrieve from DB
const fields = [{ field: 'name', label: 'Name', type: Type.Text }];

const columns = buildColumns(fields, (i: number, row: any, data: any) => (
  <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
));

const DefaultListPage: React.FC<Props> = ({ collection }) => {
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
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{collection.collection}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained" component={RouterLink} to="create">
              API
            </Button>
          </Grid>
          <Grid>
            <Button variant="contained" component={RouterLink} to="create">
              {t('button.create')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Table columns={columns} rows={rows} />
    </Stack>
  );
};

export default DefaultListPage;
