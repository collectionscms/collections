import Table from '@admin/components/elements/Table';
import Cell from '@admin/components/elements/Table/Cell';
import { Type } from '@admin/components/elements/Table/Cell/types';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import buildColumns from '@admin/utilities/buildColumns';
import { Field } from 'config/types';
import React from 'react';

const fields: Field[] = [{ field: 'name', label: 'Name', type: Type.Text }];

const columns = buildColumns(fields, (i: number, row: any, data: any) => (
  <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
));

const ContentType: React.FC = () => {
  const documentInfo = useDocumentInfo();

  const rows = [
    {
      id: 1,
      name: 'Restaurant',
    },
    {
      id: 2,
      name: 'Menu',
    },
    {
      id: 3,
      name: 'Owner',
    },
  ];

  return <Table label={documentInfo.label} columns={columns} rows={rows} />;
};

export default ContentType;
