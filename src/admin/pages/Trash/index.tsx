import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { NationalFlagIcon } from '../../components/elements/NationalFlagIcon/index.js';
import { ReactTable } from '../../components/elements/ReactTable/index.js';
import { ScrollX } from '../../components/elements/ScrollX/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { TrashContextProvider, useTrash } from './Context/index.js';
import { RestoreButton } from './RestoreButton/index.js';

const TrashPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getTrashedContents } = useTrash();
  const { data, mutate } = getTrashedContents();

  const columns = useMemo(
    () => [
      {
        id: 'title',
        Header: t('title'),
        accessor: 'title',
      },
      {
        id: 'language',
        Header: t('language'),
        accessor: 'language',
        Cell: ({ value }: { value: string }) => {
          return <NationalFlagIcon code={value} props={{ width: 20 }} />;
        },
      },
      {
        id: 'version',
        Header: t('version'),
        accessor: 'version',
      },
      {
        id: 'deletedAt',
        Header: t('deleted_at'),
        accessor: 'deletedAt',
        Cell: ({ value }: { value: Date }) => {
          return <Typography>{dayjs(value).format(t('date_format.long'))}</Typography>;
        },
      },
      {
        id: 'action',
        Header: '',
        accessor: 'id',
        width: 40,
        Cell: ({ value }: { value: string }) => {
          return <RestoreButton postId={value} onRestored={mutate} />;
        },
      },
    ],
    []
  );

  return (
    <MainCard content={false} title={<></>} secondary={<></>}>
      <ScrollX>
        <ReactTable columns={columns} data={data} />
      </ScrollX>
    </MainCard>
  );
};

export const TrashPage = ComposeWrapper({ context: TrashContextProvider })(TrashPageImpl);
