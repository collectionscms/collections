import { Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { Link } from '../../../components/elements/Link/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { ReviewContextProvider, useReview } from '../Context/index.js';

const ReviewDetailPageImpl: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const { getReview, closeReview, approveReview } = useReview();
  const { data: review, mutate } = getReview(id);
  const { trigger: closeReviewTrigger, isMutating: isCloseMutating } = closeReview(id);
  const { trigger: approveReviewTrigger, isMutating: isApproveMutating } = approveReview(id);

  const enabled = review.status === 'pending';

  const onCloseReview = async () => {
    try {
      await closeReviewTrigger();
      enqueueSnackbar(t('toast.updated_successfully'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      mutate();
    } catch (error) {
      logger.error(error);
    }
  };

  const onApproveReview = async () => {
    try {
      await approveReviewTrigger();
      enqueueSnackbar(t('toast.updated_successfully'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      mutate();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Icon name="FileText" size={16} />
                  <Icon name="ChevronRight" size={16} />
                  {!review.content.deletedAt ? (
                    <Link href={`/admin/contents/${review.contentId}`}>{review.content.id}</Link>
                  ) : (
                    <Stack flexDirection="row" gap={1}>
                      <Typography>{review.content.id}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({t('deleted')})
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Icon name="UserRound" size={16} />
                  <Typography>{review.revieweeName}</Typography>
                  <Typography>{dayjs(review.updatedAt).format(t('date_format.long'))}</Typography>
                </Stack>
                <Typography>{review.comment}</Typography>
              </Grid>
              <Grid xs={12}>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  {enabled && hasPermission('closeReview') && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={onCloseReview}
                      disabled={isCloseMutating || isApproveMutating}
                    >
                      {t('close_without_publish')}
                    </Button>
                  )}
                  {enabled && hasPermission('approveReview') && (
                    <Button
                      variant="contained"
                      onClick={onApproveReview}
                      disabled={isCloseMutating || isApproveMutating}
                    >
                      {t('approve_and_publish')}
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export const ReviewDetailPage = ComposeWrapper({ context: ReviewContextProvider })(
  ReviewDetailPageImpl
);
