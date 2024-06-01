import { Review } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { ReviewContextProvider, useReview } from './Context/index.js';

const ReviewPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getReviews } = useReview();
  const { data } = getReviews();

  const fields = [
    { field: 'title', label: t('title'), type: cells.text() },
    { field: 'updatedAt', label: t('updated_at'), type: cells.date() },
  ];

  const columns = buildColumns(fields, (i: number, row: Review, data: any) => {
    const cell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    if (i === 0) {
      return <Link href={`${row.id}`}>{cell}</Link>;
    }

    return cell;
  });

  return (
    <MainCard content={false} title={<></>} secondary={<></>}>
      <Table columns={columns} rows={data} />
    </MainCard>
  );
};

export const ReviewPage = ComposeWrapper({ context: ReviewContextProvider })(ReviewPageImpl);
