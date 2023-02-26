import { Button, Stack } from '@mui/material';
import React from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import RouterLink from '../../components/elements/Link';

const LogoutPage: React.FC = () => {
  const { t } = useTranslation();
  const [cookie, setCookie, removeCookie] = useCookies(['superfast-token']);
  removeCookie('superfast-token', { path: '/' });

  return (
    <Stack rowGap={3}>
      <h2>{t('logged_out')}</h2>
      <Button variant="outlined" size="large" component={RouterLink} to="/admin/auth/login">
        {t('log_back_in')}
      </Button>
    </Stack>
  );
};

export default LogoutPage;
