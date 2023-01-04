import RouterLink from '@admin/components/elements/Link';
import { Box, Button, Checkbox, FormLabel, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CreatePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>Create Collection</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained" component={RouterLink} to="../content-types/1">
              {t('button.create')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} xs={12} xl={6}>
        <Grid xs={12} md={6}>
          <FormLabel>Collection Name</FormLabel> <TextField id="name" fullWidth />
        </Grid>
        <Grid xs={12} md={6}>
          <FormLabel>Singleton</FormLabel>
          <Box>
            <Checkbox {...{ inputProps: { 'aria-label': 'Checkbox demo' } }} defaultChecked />
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CreatePage;
