import Table from '@admin/components/elements/Table';
import Cell from '@admin/components/elements/Table/Cell';
import { Type } from '@admin/components/elements/Table/Cell/types';
import buildColumns from '@admin/utilities/buildColumns';
import React from 'react';
import { Props } from './types';

// TODO Retrieve from DB
const fields = [{ field: 'name', label: 'Name', type: Type.Text }];

const columns = buildColumns(fields, (i: number, row: any, data: any) => (
  <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
));

const DefaultListPage: React.FC<Props> = ({ collection }) => {
  const rows = [
    {
      id: 1,
      name: 'collection1',
    },
    {
      id: 2,
      name: 'collection2',
    },
  ];

  return <Table label={collection} columns={columns} rows={rows} />;
};

export default DefaultListPage;
