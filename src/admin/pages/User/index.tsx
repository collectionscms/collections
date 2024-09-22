import { Chip, Stack, Typography } from '@mui/material';
import { Role } from '@prisma/client';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row } from 'react-table';
import { UserProfile } from '../../../types/index.js';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { ReactTable } from '../../components/elements/ReactTable/index.js';
import { ScrollX } from '../../components/elements/ScrollX/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { UserContextProvider, useUser } from './Context/index.js';

const UserPageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getUsers } = useUser();
  const { data } = getUsers();

  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: t('name'),
        accessor: 'name',
        Cell: ({ row }: { row: Row }) => {
          const user = row.original as UserProfile;
          if (user.isRegistered) {
            return hasPermission('updateUser') ? (
              <Link href={`${user.id}`}>{user.name}</Link>
            ) : (
              <Typography>{user.name}</Typography>
            );
          } else {
            return (
              <Stack flexDirection="row" gap={1}>
                <Typography>{user.name}</Typography>
                <Chip label={t('invited')} color="warning" size="small" />
              </Stack>
            );
          }
        },
      },
      {
        id: 'email',
        Header: t('email'),
        accessor: 'email',
      },
      {
        id: 'role',
        Header: t('role'),
        accessor: 'role',
        Cell: ({ value }: { value: Role }) => {
          return <Typography>{value.name}</Typography>;
        },
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
        hasPermission('inviteUser') && <CreateNewButton onClick={() => navigate('create')} />
      }
    >
      <ScrollX>
        <ReactTable columns={columns} data={data} />
      </ScrollX>
    </MainCard>
  );
};

export const UserPage = ComposeWrapper({ context: UserContextProvider })(UserPageImpl);
