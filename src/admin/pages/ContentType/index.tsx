import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import buildColumns from '@admin/utilities/buildColumns';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Type } from '@admin/components/elements/Table/Cell/types';

const fields = [{ field: 'name', label: 'Name', type: Type.Text }];

const ContentTypePage: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();

  const columns = buildColumns(fields);

  const rows = [
    {
      id: 1,
      name: 'Restaurant',
    },
    {
      id: 2,
      name: 'Menu',
    },
    {
      id: 3,
      name: 'Owner',
    },
  ];

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{localizedLabel}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
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

export default ContentTypePage;
