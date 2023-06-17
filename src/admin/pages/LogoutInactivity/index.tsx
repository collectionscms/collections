import { Button, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../utilities/logger.js';
import { RouterLink } from '../../components/elements/Link/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';

export const LogoutInactivity: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { trigger } = logout();

  useEffect(() => {
    const logout = async () => {
      try {
        await trigger();
      } catch (e) {
        logger.error(e);
      }
    };

    logout();
  }, []);

  return (
    <>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <h1>{t('logout_inactivity')}</h1>
      </Stack>
      <Button variant="outlined" size="large" component={RouterLink} to="/admin/auth/login">
        {t('log_back_in')}
      </Button>
    </>
  );
};
