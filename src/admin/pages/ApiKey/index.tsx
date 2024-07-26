import { CopyOutlined } from '@ant-design/icons';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../../types/index.js';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { ApiKeyContextProvider, useApiKey } from './Context/index.js';

const ApiKeyPageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getApiKeys } = useApiKey();
  const { data } = getApiKeys();
  const { enqueueSnackbar } = useSnackbar();

  const fields = [
    { field: 'name', label: t('name'), type: cells.text() },
    { field: 'key', label: t('api_key'), type: cells.text() },
    { field: 'createdAt', label: t('created_at'), type: cells.date() },
    { field: 'updatedAt', label: t('updated_at'), type: cells.date() },
  ];

  const maskUuidExceptLast4 = (uuid: string) => {
    return `${'*'.repeat(uuid.length - 4)}${uuid.slice(-4)}`;
  };

  const handleCopy = (result: boolean) => {
    if (!result) return;
    enqueueSnackbar(t('toast.copied'), { variant: 'success' });
  };

  const columns = buildColumns(fields, (i: number, row: UserProfile, data: any) => {
    const defaultCell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    switch (fields[i].field) {
      case 'name':
        return hasPermission('updateApiKey') ? (
          <Link href={`${row.id}`}>{defaultCell}</Link>
        ) : (
          <>{defaultCell}</>
        );
      case 'key':
        return (
          <Stack direction="row" alignItems="center" gap={1}>
            {maskUuidExceptLast4(data)}
            <CopyToClipboard text={data} onCopy={(text, result) => handleCopy(result)}>
              <Tooltip title="Copy" placement="bottom">
                <IconButton>
                  <CopyOutlined />
                </IconButton>
              </Tooltip>
            </CopyToClipboard>
          </Stack>
        );
      default:
        return defaultCell;
    }
  });

  return (
    <MainCard
      content={false}
      title={<></>}
      secondary={
        hasPermission('inviteUser') && <CreateNewButton onClick={() => navigate('create')} />
      }
    >
      <Table columns={columns} rows={data} />
    </MainCard>
  );
};

export const ApiKeyPage = ComposeWrapper({ context: ApiKeyContextProvider })(ApiKeyPageImpl);
