import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import { Button, InputLabel, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ProjectSetting } from '@shared/types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ProjectPage: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();

  const data: ProjectSetting = { name: 'superfast' };

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{localizedLabel}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained">{t('update')}</Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} xs={12} xl={6}>
        <Grid xs={12} md={6}>
          <InputLabel required>{t('project_name')}</InputLabel>
          <TextField id="name" type="text" fullWidth value={data.name} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ProjectPage;
