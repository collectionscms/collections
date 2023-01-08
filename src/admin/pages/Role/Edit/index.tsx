import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import RouterLink from '@admin/components/elements/Link';
import { Stack, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import DeleteDocument from '@admin/components/elements/DeleteDocument';

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
                <DeleteDocument id={id} slug={`roles`} onSuccess={handleDeletionSuccess} />
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
