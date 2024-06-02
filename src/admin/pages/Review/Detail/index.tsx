import { FileTextOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
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

  const enabled = review.status === 'request';

  const onCloseReview = async () => {
    try {
      await closeReviewTrigger();
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      mutate();
    } catch (error) {
      logger.error(error);
    }
  };

  const onApproveReview = async () => {
    try {
      await approveReviewTrigger();
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
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
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <FileTextOutlined />
                  <RightOutlined />
                  <Link href={`/admin/posts/${review.postId}`}>{review.postId}</Link>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="h4">{review.title}</Typography>
                  <Typography>{review.body}</Typography>
                </Stack>
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
