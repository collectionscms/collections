import { Role } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { RoleContextProvider, useRole } from './Context/index.js';

const RolePageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getRoles } = useRole();
  const { data } = getRoles();

  const fields = [
    { field: 'name', label: t('name'), type: cells.text() },
    { field: 'description', label: t('description'), type: cells.text() },
    { field: 'updatedAt', label: t('updated_at'), type: cells.date() },
  ];

  const columns = buildColumns(fields, (i: number, row: Role, data: any) => {
    const cell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    if (i === 0) {
      return hasPermission('updateRole') ? <Link href={`${row.id}`}>{cell}</Link> : cell;
    }

    return cell;
  });

  return (
    <MainCard
      content={false}
      title={<></>}
      secondary={
        hasPermission('createRole') && <CreateNewButton onClick={() => navigate('create')} />
      }
    >
      <Table columns={columns} rows={data} />
    </MainCard>
  );
};

export const RolePage = ComposeWrapper({ context: RoleContextProvider })(RolePageImpl);
