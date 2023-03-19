import { AddOutlined } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RouterLink from '../../components/elements/Link';
import Table from '../../components/elements/Table';
import { Type } from '../../components/elements/Table/Cell/types';
import ComposeWrapper from '../../components/utilities/ComposeWrapper';
import { useDocumentInfo } from '../../components/utilities/DocumentInfo';
import buildColumns from '../../utilities/buildColumns';
import { RoleContextProvider, useRole } from "./Context";

const RolePage: React.FC = () => {
  const { t } = useTranslation();
  const { localizedLabel } = useDocumentInfo();
  const { getRoles } = useRole();
  const { data } = getRoles();

  const fields = [
    { field: 'name', label: t('name'), type: Type.Text },
    { field: 'description', label: t('description'), type: Type.Text },
    { field: 'updatedAt', label: t('updated_at'), type: Type.Date },
  ];

  const columns = buildColumns(fields);

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid container alignItems="center" spacing={3}>
          <Grid>
            <h1>{localizedLabel}</h1>
          </Grid>
          <Grid>
            <Button
              variant="outlined"
              startIcon={<AddOutlined />}
              component={RouterLink}
              to="create"
            >
              {t('create_new')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {data !== undefined && <Table columns={columns} rows={data} />}
    </Stack>
  );
};

export default ComposeWrapper({ context: RoleContextProvider })(RolePage);
