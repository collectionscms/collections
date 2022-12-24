import Table from '@admin/components/elements/Table';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import buildColumns from '@admin/utilities/buildColumns';
import React from 'react';

const Role: React.FC = () => {
  const { fields, label } = useDocumentInfo();
  const columns = buildColumns(fields);

  const rows = [
    {
      id: 1,
      name: 'Admin',
      description: 'Super Admins can access and manage all features and settings.',
      createdAt: '1670637496808',
    },
    {
      id: 2,
      name: 'Editor',
      description: 'Editors can manage and publish contents including those of other users.',
      createdAt: '1670648096808',
    },
  ];

  return <Table label={label} columns={columns} rows={rows} />;
};

export default Role;
