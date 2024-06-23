import { Review } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { TrashContextProvider, useTrash } from './Context/index.js';

const TrashPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getTrashedPosts } = useTrash();
  const { data } = getTrashedPosts();

  const fields = [{ field: 'title', label: t('title'), type: cells.text() }];

  const columns = buildColumns(fields, (i: number, row: Review, data: any) => {
    const cell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    return cell;
  });

  return (
    <MainCard content={false} title={<></>} secondary={<></>}>
      <Table columns={columns} rows={data} />
    </MainCard>
  );
};

export const TrashPage = ComposeWrapper({ context: TrashContextProvider })(TrashPageImpl);
