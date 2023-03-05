import { AddOutlined } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../../shared/types';
import RouterLink from '../../components/elements/Link';
import Table from '../../components/elements/Table';
import Cell from '../../components/elements/Table/Cell';
import { Type } from '../../components/elements/Table/Cell/types';
import ComposeWrapper from '../../components/utilities/ComposeWrapper';
import { useDocumentInfo } from '../../components/utilities/DocumentInfo';
import { UserContextProvider, useUser } from '../../pages/User/Context';
import buildColumns from '../../utilities/buildColumns';

const UserPage: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const { getUsers } = useUser();
  const { data } = getUsers();

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

  return (
    <Stack rowGap={3}>
      <Grid container>
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
      {/* <SearchFilter fieldName="userName" fieldLabel={t('user_name')} /> */}
      <Table columns={columns} rows={data} />
    </Stack>
  );
};

export default ComposeWrapper({ context: UserContextProvider })(UserPage);
