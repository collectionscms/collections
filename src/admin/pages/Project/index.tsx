import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ProjectPage: React.FC = () => {
  const { label } = useDocumentInfo();
  const { t } = useTranslation();

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{t(`page.index.${label}` as unknown as TemplateStringsArray)}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained">{t('button.update')}</Button>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ProjectPage;
