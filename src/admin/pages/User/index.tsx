import { AddOutlined } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../../config/types.js';
import { RouterLink } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { Type } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { useDocumentInfo } from '../../components/utilities/DocumentInfo/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { UserContextProvider, useUser } from './Context/index.js';

const UserPageImpl: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const { getUsers } = useUser();
  const { data } = getUsers();

  const fields = [
    { field: 'user_name', label: t('user_name'), type: Type.Text },
    { field: 'name', label: t('name'), type: Type.Text },
    { field: 'email', label: t('email'), type: Type.Text },
    { field: 'api_key', label: t('api_key'), type: Type.Text },
    { field: 'role', label: t('role'), type: Type.Text },
    { field: 'updated_at', label: t('updated_at'), type: Type.Date },
  ];

  const columns = buildColumns(fields, (i: number, row: User, data: any) => {
    const defaultCell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    switch (fields[i].field) {
      case 'name':
        return (
          <Cell
            colIndex={i}
            type={fields[i].type}
            cellData={`${row.last_name} ${row.first_name}`}
          />
        );
      case 'api_key':
        return <Cell colIndex={i} type={fields[i].type} cellData={row.api_key && t('valid')} />;
      case 'role':
        return <Cell colIndex={i} type={fields[i].type} cellData={row.role?.name} />;
      case 'user_name':
        return <RouterLink to={`${row.id}`}>{defaultCell}</RouterLink>;
      default:
        return defaultCell;
    }
  });

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
      {data !== undefined && <Table columns={columns} rows={data} />}
    </Stack>
  );
};

export const UserPage = ComposeWrapper({ context: UserContextProvider })(UserPageImpl);
