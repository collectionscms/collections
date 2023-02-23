import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import Cell from '@admin/components/elements/Table/Cell';
import { Type } from '@admin/components/elements/Table/Cell/types';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import buildColumns from '@admin/utilities/buildColumns';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SearchFilter from '@admin/components/elements/SearchFilter';
import { UserContextProvider, useUser } from '@admin/pages/User/Context';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { User } from '@shared/types';
import { useSnackbar } from 'notistack';
import fields from '@server/controllers/fields';
import { error } from 'console';
import { t } from 'i18next';

const UserPage: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const { getUsers } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const { data, error } = getUsers();

  const fields = [
    { field: 'userName', label: t('user_name'), type: Type.Text },
    { field: 'name', label: t('name'), type: Type.Text },
    { field: 'email', label: t('email'), type: Type.Text },
    { field: 'apiKey', label: t('api_key'), type: Type.Text },
    { field: 'role', label: t('role'), type: Type.Text },
    { field: 'updatedAt', label: t('updated_at'), type: Type.Date },
  ];

  const columns = buildColumns(fields, (i: number, row: User, data: any) =>
    fields[i].field == 'name' ? (
      <Cell
        colIndex={i}
        type={fields[i].type}
        rowData={row}
        cellData={`${row.lastName} ${row.firstName}`}
      />
    ) : fields[i].field == 'apiKey' ? (
      <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={row.apiKey && t('valid')} />
    ) : fields[i].field == 'role' ? (
      <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={row.role.name} />
    ) : (
      <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
    )
  );

  useEffect(() => {
    if (error === undefined) return;
    enqueueSnackbar(error, { variant: 'error' });
  }, [error]);

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
      <SearchFilter fieldName="userName" fieldLabel={t('user_name')} />
      <Table columns={columns} rows={data || []} />
    </Stack>
  );
};

export default ComposeWrapper({ context: UserContextProvider })(UserPage);
