import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Review } from '@prisma/client';
import dayjs from 'dayjs';
import React, { ChangeEvent, useMemo, useState } from 'react';
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
  const { getPendingReviews, getApprovedReviews, getClosedReviews } = useReview();
  const { data: pendingReviews } = getPendingReviews();
  const { data: approvedReviews } = getApprovedReviews();
  const { data: closedReviews } = getClosedReviews();

  const columns = useMemo(
    () => [
      {
        id: 'comment',
        Header: t('comment'),
        accessor: 'comment',
        Cell: ({ row }: { row: Row }) => {
          const review = row.original as Review;
          return (
            <Link
              href={`${review.id}`}
              sx={{
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {review.comment}
            </Link>
          );
        },
      },
      {
        id: 'revieweeName',
        Header: t('requester'),
        accessor: 'revieweeName',
        width: 60,
      },
      {
        id: 'updatedAt',
        Header: t('updated_at'),
        accessor: 'updatedAt',
        width: 60,
        Cell: ({ value }: { value: Date }) => {
          return <Typography>{dayjs(value).format(t('date_format.long'))}</Typography>;
        },
      },
    ],
    []
  );

  const statues = ['pending', 'approved', 'closed'];
  const [activeTab, setActiveTab] = useState(statues[0]);

  return (
    <MainCard
      content={false}
      title={
        <Box sx={{ mb: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(e: ChangeEvent<{}>, value: string) => setActiveTab(value)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {statues.map((status: string, index: number) => (
              <Tab
                key={index}
                label={t(`post_review_status.${status}` as unknown as TemplateStringsArray)}
                value={status}
              />
            ))}
          </Tabs>
        </Box>
      }
    >
      <ScrollX>
        <ReactTable
          columns={columns}
          data={
            activeTab === 'pending'
              ? pendingReviews
              : activeTab === 'approved'
                ? approvedReviews
                : closedReviews
          }
        />
      </ScrollX>
    </MainCard>
  );
};

export const ReviewPage = ComposeWrapper({ context: ReviewContextProvider })(ReviewPageImpl);
