import { MainCard } from '@collectionscms/plugin-ui';
import { Link, Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const NavCard = () => {
  const { t } = useTranslation();

  return (
    <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
      <Stack alignItems="center" spacing={2} sx={{ whiteSpace: 'break-spaces' }}>
        <Stack alignItems="center">
          <Typography variant="h6" color="secondary">
            {t('how_was_it')}
          </Typography>
          <Typography variant="h6">
            <Link href={t('feedback_google_form')} target="_blank" rel="noopener noreferrer">
              {t('leaving_feedback')}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
};
