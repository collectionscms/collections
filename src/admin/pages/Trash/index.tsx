import { Content } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { NationalFlagIcon } from '../../components/elements/NationalFlagIcon/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { TrashContextProvider, useTrash } from './Context/index.js';
import { RestoreButton } from './RestoreButton/index.js';

const TrashPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getTrashedContents } = useTrash();
  const { data, mutate } = getTrashedContents();

  const fields = [
    { field: 'title', label: t('title'), type: cells.text() },
    { field: 'language', label: t('language'), type: cells.text() },
    { field: 'version', label: t('version'), type: cells.text() },
    { field: 'deletedAt', label: t('deleted_at'), type: cells.date() },
    { field: 'action', label: '', type: cells.text(), width: 80 },
  ];

  const columns = buildColumns(fields, (i: number, row: Content, data: any) => {
    const cell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    switch (fields[i].field) {
      case 'language':
        return <NationalFlagIcon code={row.language} props={{ width: 20 }} />;
      case 'action':
        return <RestoreButton postId={row.id} onRestored={mutate} />;
      default:
        return cell;
    }
  });

  return (
    <MainCard content={false} title={<></>} secondary={<></>}>
      <Table columns={columns} rows={data} />
    </MainCard>
  );
};

export const TrashPage = ComposeWrapper({ context: TrashContextProvider })(TrashPageImpl);
