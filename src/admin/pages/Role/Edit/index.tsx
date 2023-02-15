import DeleteHeaderButton from '@admin/components/elements/DeleteHeaderButton';
import RouterLink from '@admin/components/elements/Link';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const EditPage: React.FC = () => {
  const { id } = useParams();
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDeletionSuccess = () => {
    navigate(`../roles`);
  };

  return (
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{localizedLabel}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          {id ? (
            <>
              <Grid>
                <DeleteHeaderButton id={id} slug={`roles`} onSuccess={handleDeletionSuccess} />
              </Grid>
              <Grid>
                <Button variant="contained" component={RouterLink} to="../roles">
                  {t('update')}
                </Button>
              </Grid>
            </>
          ) : (
            <Grid>
              <Button variant="contained" component={RouterLink} to="../roles">
                {t('create_new')}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
};

export default EditPage;
