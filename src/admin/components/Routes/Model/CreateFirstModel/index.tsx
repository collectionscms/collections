import { Button, Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ImportFile } from '../../../elements/ImportFileDialog/index.js';
import { useConfig } from '../../../utilities/Config/index.js';

export const CreateFirstModel: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const config = useConfig();

  const showDialog = () => {
    setOpen(true);
  };

  const handleDialog = (success: boolean) => {
    setOpen(!open);
    if (success) {
      config.revalidateModels();
    }
  };

  return (
    <>
      <ImportFile
        open={open}
        onSuccess={() => handleDialog(true)}
        onClose={() => handleDialog(false)}
      />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', overflow: 'hidden' }}
      >
        <Grid xs={12}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="h2">{t('register_data_model')}</Typography>
            <Typography
              color="textSecondary"
              align="center"
              sx={{ width: { xs: '73%', sm: '61%' } }}
            >
              {t('create_first_data_model')}
            </Typography>
            <Stack direction="row" justifyContent="space-around" alignItems="center" gap={3}>
              <Stack spacing={0.5} alignItems="center">
                <Button
                  component={RouterLink}
                  to="/admin/settings/models/create"
                  variant="contained"
                >
                  {t('go_to_registration')}
                </Button>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack spacing={0.5} alignItems="center">
                <Button onClick={showDialog} variant="contained">
                  {t('import_from_wordpress_xml')}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};
