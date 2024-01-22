import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { logger } from '../../../utilities/logger.js';
import { useAuth } from '../../components/utilities/Auth/index.js';

export const Logout: React.FC = () => {
  const { t } = useTranslation();
  const { getCsrfToken, logout } = useAuth();
  const { data: csrfToken } = getCsrfToken();
  const { trigger } = logout();

  useEffect(() => {
    const logout = async () => {
      try {
        await trigger({
          csrfToken: csrfToken,
        });
      } catch (e) {
        logger.error(e);
      }
    };

    logout();
  }, [csrfToken]);

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">{t('logged_out')}</Typography>
        </Box>
      </Grid>
      <Grid xs={12}>
        <Button
          component={RouterLink}
          to="/admin/auth/login"
          disableElevation
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="primary"
        >
          {t('log_back_in')}
        </Button>
      </Grid>
    </Grid>
  );
};
