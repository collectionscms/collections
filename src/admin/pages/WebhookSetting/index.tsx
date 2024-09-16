import { Typography } from '@mui/material';
import { WebhookSetting } from '@prisma/client';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row } from 'react-table';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { EnabledDot } from '../../components/elements/EnabledDot/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { ReactTable } from '../../components/elements/ReactTable/index.js';
import { ScrollX } from '../../components/elements/ScrollX/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { useWebhookSetting, WebhookContextProvider } from './Context/index.js';

const WebhookSettingPageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getWebhookSettings } = useWebhookSetting();
  const { data } = getWebhookSettings();

  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: t('name'),
        accessor: 'name',
        Cell: ({ row }: { row: Row }) => {
          const webhookSetting = row.original as WebhookSetting;
          return hasPermission('updateWebhookSetting') ? (
            <Link href={`${webhookSetting.id}`}>{webhookSetting.name}</Link>
          ) : (
            <Typography>{webhookSetting.name}</Typography>
          );
        },
      },
      {
        id: 'provider',
        Header: t('provider'),
        accessor: 'provider',
        Cell: ({ value }: { value: string }) => {
          return (
            <Typography>{t(`providers.${value}` as unknown as TemplateStringsArray)}</Typography>
          );
        },
      },
      {
        id: 'enabled',
        Header: t('status'),
        accessor: 'enabled',
        Cell: ({ row }: { row: Row }) => {
          const webhookSetting = row.original as WebhookSetting;
          return <EnabledDot enabled={webhookSetting.enabled} />;
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
        hasPermission('createWebhookSetting') && (
          <CreateNewButton onClick={() => navigate('create')} />
        )
      }
    >
      <ScrollX>
        <ReactTable columns={columns} data={data} />
      </ScrollX>
    </MainCard>
  );
};

export const WebhookSettingPage = ComposeWrapper({ context: WebhookContextProvider })(
  WebhookSettingPageImpl
);
