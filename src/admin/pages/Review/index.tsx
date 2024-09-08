import { Typography } from '@mui/material';
import { Review } from '@prisma/client';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from 'react-table';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { ReactTable } from '../../components/elements/ReactTable/index.js';
import { ScrollX } from '../../components/elements/ScrollX/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { ReviewContextProvider, useReview } from './Context/index.js';

const ReviewPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getReviews } = useReview();
  const { data } = getReviews();

  const columns = useMemo(
    () => [
      {
        id: 'comment',
        Header: t('comment'),
        accessor: 'comment',
        Cell: ({ row }: { row: Row }) => {
          const review = row.original as Review;
          return <Link href={`${review.id}`}>{review.comment}</Link>;
        },
      },
      {
        id: 'status',
        Header: t('status'),
        accessor: 'status',
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
    <MainCard content={false} title={<></>} secondary={<></>}>
      <ScrollX>
        <ReactTable columns={columns} data={data} />
      </ScrollX>
    </MainCard>
  );
};

export const ReviewPage = ComposeWrapper({ context: ReviewContextProvider })(ReviewPageImpl);
