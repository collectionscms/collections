import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import Cell from '@admin/components/elements/Table/Cell';
import { Type } from '@admin/components/elements/Table/Cell/types';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import buildColumns from '@admin/utilities/buildColumns';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';

const fields = [
  { field: 'name', label: 'Name', type: Type.Text },
  { field: 'email', label: 'Email', type: Type.Text },
  { field: 'role', label: 'Role', type: Type.Text },
  { field: 'userName', label: 'User Name', type: Type.Text },
  { field: 'status', label: 'Status', type: Type.Text },
  { field: 'createdAt', label: 'Created At', type: Type.Date },
];

const UserPage = () => {
  const { label } = useDocumentInfo();
  const { t } = useTranslation();

  const columns = buildColumns(fields, (i: number, row: any, data: any) =>
    fields[i].field == 'name' ? (
      <Cell
        colIndex={i}
        type={fields[i].type}
        rowData={row}
        cellData={`${row.lastName} ${row.firstName}`}
      />
    ) : (
      <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
    )
  );

  const rows = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Henderson',
      email: 'alice@example.com',
      role: 'Admin',
      userName: 'alice',
      status: 'Active',
      createdAt: '1670637496808',
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Sanders',
      email: 'bob@example.com',
      role: 'Editor',
      userName: 'bob',
      status: 'Invited',
      createdAt: '1670637496808',
    },
  ];

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{t(`page.index.${label}` as unknown as TemplateStringsArray)}</h1>
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

export default UserPage;
