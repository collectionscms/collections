import { MainCard } from '@collectionscms/plugin-ui';
import { Role, User } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { UserContextProvider, useUser } from './Context/index.js';

const UserPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getUsers } = useUser();
  const { data } = getUsers();

  const fields = [
    { field: 'name', label: t('name'), type: cells.text() },
    { field: 'email', label: t('email'), type: cells.text() },
    { field: 'apiKey', label: t('api_key'), type: cells.text() },
    { field: 'role', label: t('role'), type: cells.text() },
    { field: 'updatedAt', label: t('updated_at'), type: cells.date() },
  ];

  const columns = buildColumns(fields, (i: number, row: User & { role: Role }, data: any) => {
    const defaultCell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    switch (fields[i].field) {
      case 'apiKey':
        return <Cell colIndex={i} type={fields[i].type} cellData={row.apiKey && t('valid')} />;
      case 'role':
        return <Cell colIndex={i} type={fields[i].type} cellData={row.role.name} />;
      case 'name':
        return <Link href={`${row.id}`}>{defaultCell}</Link>;
      default:
        return defaultCell;
    }
  });

  return (
    <MainCard content={false} title={<></>} secondary={<CreateNewButton to="create" />}>
      <Table columns={columns} rows={data} />
    </MainCard>
  );
};

export const UserPage = ComposeWrapper({ context: UserContextProvider })(UserPageImpl);
