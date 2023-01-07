import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import { Type } from '@admin/components/elements/Table/Cell/types';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import buildColumns from '@admin/utilities/buildColumns';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';

const fields = [
  { field: 'name', label: 'Name', type: Type.Text },
  { field: 'description', label: 'Description', type: Type.Text },
  { field: 'createdAt', label: 'Created At', type: Type.Date },
];

const RolePage: React.FC = () => {
  const { t } = useTranslation();
  const { localizedLabel } = useDocumentInfo();

  const columns = buildColumns(fields);

  const rows = [
    {
      id: 1,
      name: 'Admin',
      description: 'Super Admins can access and manage all features and settings.',
      createdAt: '1670637496808',
    },
    {
      id: 2,
      name: 'Editor',
      description: 'Editors can manage and publish contents including those of other users.',
      createdAt: '1670648096808',
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
              {t('create_new')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Table columns={columns} rows={rows} />
    </Stack>
  );
};

export default RolePage;
