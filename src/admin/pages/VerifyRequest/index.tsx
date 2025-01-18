import { Box, Link, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { AuthCard } from '../../@extended/components/AuthCard/index.js';
import { Logo } from '../../components/elements/Logo/index.js';

export const VerifyRequest: React.FC = () => {
  return (
    <>
      <Box sx={{ position: 'absolute', top: 30, left: 40 }}>
        <Link href="https://collections.dev">
          <Logo variant="logo" props={{ width: 'auto', height: 28 }} />
        </Link>
      </Box>
      <Stack sx={{ width: { xs: 400, lg: 475 }, gap: 3 }}>
        <AuthCard sx={{ p: 2 }}>
          <Typography variant="h3" sx={{ mb: 1, textAlign: 'center' }}>
            {t('check_your_email')}
          </Typography>
          <Typography variant="body1" sx={{ my: 3 }}>
            {t('we_send_verification_email')}
          </Typography>
          <Link href="/admin/auth/login">{t('back_to_login')}</Link>
        </AuthCard>
      </Stack>
    </>
  );
};
