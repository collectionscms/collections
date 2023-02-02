import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import { Type } from '@admin/components/elements/Table/Cell/types';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import { RoleContextProvider, useRole } from '@admin/stores/Role';
import buildColumns from '@admin/utilities/buildColumns';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RolePage: React.FC = () => {
  const { t } = useTranslation();
  const { localizedLabel } = useDocumentInfo();
  const { getRoles, roles } = useRole();

  const fields = [
    { field: 'name', label: t('name'), type: Type.Text },
    { field: 'description', label: t('description'), type: Type.Text },
    { field: 'updatedAt', label: t('updated_at'), type: Type.Date },
  ];

  const columns = buildColumns(fields);

  useEffect(() => {
    getRoles();
  }, []);

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
      <Table columns={columns} rows={roles} />
    </Stack>
  );
};

export default ComposeWrapper({ context: RoleContextProvider })(RolePage);
