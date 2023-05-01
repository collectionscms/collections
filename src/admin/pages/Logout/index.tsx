import { Button, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterLink } from '../../components/elements/Link/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';

export const Logout: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return (
    <>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <h1>{t('logged_out')}</h1>
      </Stack>
      <Button variant="outlined" size="large" component={RouterLink} to="/admin/auth/login">
        {t('log_back_in')}
      </Button>
    </>
  );
};
