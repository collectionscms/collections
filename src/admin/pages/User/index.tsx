import Table from '@admin/components/elements/Table';
import Cell from '@admin/components/elements/Table/Cell';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import buildColumns from '@admin/utilities/buildColumns';
import React from 'react';

const UserPage = () => {
  const { fields, label } = useDocumentInfo();

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

  return <Table label={label} columns={columns} rows={rows} />;
};

export default UserPage;
