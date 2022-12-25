import Table from '@admin/components/elements/Table';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import buildColumns from '@admin/utilities/buildColumns';
import React from 'react';

const ContentTypePage: React.FC = () => {
  const { fields, label } = useDocumentInfo();
  const columns = buildColumns(fields);

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

  return <Table label={label} columns={columns} rows={rows} />;
};

export default ContentTypePage;
