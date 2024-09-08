import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { ApiKey } from '@prisma/client';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import React, { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row } from 'react-table';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Icon } from '../../components/elements/Icon/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { ReactTable } from '../../components/elements/ReactTable/index.js';
import { ScrollX } from '../../components/elements/ScrollX/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { ApiKeyContextProvider, useApiKey } from './Context/index.js';

const ApiKeyPageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getApiKeys } = useApiKey();
  const { data } = getApiKeys();
  const { enqueueSnackbar } = useSnackbar();

  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: t('name'),
        accessor: 'name',
        Cell: ({ row }: { row: Row }) => {
          const apiKey = row.original as ApiKey;
          return hasPermission('updateApiKey') ? (
            <Link href={`${apiKey.id}`}>{apiKey.name}</Link>
          ) : (
            <Typography>{apiKey.name}</Typography>
          );
        },
      },
      {
        id: 'key',
        Header: t('api_key'),
        accessor: 'key',
        Cell: ({ value }: { value: string }) => {
          const maskUuidExceptLast4 = (uuid: string) => {
            return `${'*'.repeat(uuid.length - 4)}${uuid.slice(-4)}`;
          };

          const handleCopy = (result: boolean) => {
            if (!result) return;
            enqueueSnackbar(t('toast.copied'), { variant: 'success' });
          };

          return (
            <Stack direction="row" alignItems="center">
              {maskUuidExceptLast4(value)}
              <CopyToClipboard text={value} onCopy={(_text, result) => handleCopy(result)}>
                <Tooltip title="Copy" placement="bottom">
                  <IconButton>
                    <Icon name="Copy" size={16} />
                  </IconButton>
                </Tooltip>
              </CopyToClipboard>
            </Stack>
          );
        },
      },
      {
        id: 'createdAt',
        Header: t('created_at'),
        accessor: 'createdAt',
        Cell: ({ value }: { value: Date }) => {
          return <Typography>{dayjs(value).format(t('date_format.long'))}</Typography>;
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
        hasPermission('createApiKey') && <CreateNewButton onClick={() => navigate('create')} />
      }
    >
      <ScrollX>
        <ReactTable columns={columns} data={data} />
      </ScrollX>
    </MainCard>
  );
};

export const ApiKeyPage = ComposeWrapper({ context: ApiKeyContextProvider })(ApiKeyPageImpl);
