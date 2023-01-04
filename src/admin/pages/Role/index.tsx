import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import buildColumns from '@admin/utilities/buildColumns';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';

const RolePage: React.FC = () => {
  const { fields, label } = useDocumentInfo();
  const columns = buildColumns(fields);
  const { t } = useTranslation();

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
          <h1>{label}</h1>
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

export default RolePage;
