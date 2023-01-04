import { useAuth } from '@admin/components/utilities/Auth';
import { useConfig } from '@admin/components/utilities/Config';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from './types';

const ApiPreview: React.FC<Props> = ({ path }) => {
  const { user } = useAuth();
  const { serverUrl } = useConfig();
  const { t } = useTranslation();

  const apiUrl = `${serverUrl}/api`;

  return (
    <Box sx={{ maxWidth: 800, p: 3 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid xs>
          {apiUrl}/{path}
        </Grid>
        <Grid>
          <Button variant="contained">{t('button.fetch')}</Button>
        </Grid>
      </Grid>
      <p>your token: {user.token}</p>
      <p>
        curl {apiUrl}/{path} -H "access_token:
        {user.token}"
      </p>
    </Box>
  );
};

export default ApiPreview;
