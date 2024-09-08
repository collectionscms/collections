import { Typography } from '@mui/material';
import { Role } from '@prisma/client';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row } from 'react-table';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { ReactTable } from '../../components/elements/ReactTable/index.js';
import { ScrollX } from '../../components/elements/ScrollX/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { RoleContextProvider, useRole } from './Context/index.js';

const RolePageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getRoles } = useRole();
  const { data } = getRoles();

  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: t('name'),
        accessor: 'name',
        Cell: ({ row }: { row: Row }) => {
          const role = row.original as Role;
          return hasPermission('updateRole') ? (
            <Link href={`${role.id}`}>{role.name}</Link>
          ) : (
            <Typography>{role.name}</Typography>
          );
        },
      },
      {
        id: 'description',
        Header: t('description'),
        accessor: 'description',
      },
      {
        id: 'updatedAt',
        Header: t('updated_at'),
        accessor: 'updatedAt',
        Cell: ({ value }: { value: Date }) => {
          return <Typography>{dayjs(value).format(t('date_format.long'))}</Typography>;
        },
      },
    ],
    []
  );

  return (
    <MainCard
      content={false}
      title={<></>}
      secondary={
        hasPermission('createRole') && <CreateNewButton onClick={() => navigate('create')} />
      }
    >
      <ScrollX>
        <ReactTable columns={columns} data={data} />
      </ScrollX>
    </MainCard>
  );
};

export const RolePage = ComposeWrapper({ context: RoleContextProvider })(RolePageImpl);
