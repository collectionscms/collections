import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from './types';

const ApiPreview: React.FC<Props> = ({ path }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 800, p: 3 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid xs></Grid>
        <Grid>
          <Button variant="contained">{t('fetch')}</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApiPreview;
