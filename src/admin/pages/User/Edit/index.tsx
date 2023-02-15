import DeleteHeaderButton from '@admin/components/elements/DeleteHeaderButton';
import RouterLink from '@admin/components/elements/Link';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export type OnChange<T = string> = (value: T) => void;

const EditPage: React.FC = () => {
  const { id } = useParams();
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDeletionSuccess = () => {
    navigate(`../users`);
  };

  return (
    <>
      <Stack rowGap={3}>
        <Grid container spacing={2}>
          <Grid xs={12} sm>
            <h1>{localizedLabel}</h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            {id ? (
              <>
                <Grid>
                  <DeleteHeaderButton id={id} slug={`users`} onSuccess={handleDeletionSuccess} />
                </Grid>
                <Grid>
                  <Button variant="contained" component={RouterLink} to="../users">
                    {t('update')}
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid>
                <Button variant="contained" component={RouterLink} to="../users">
                  {t('create_new')}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default EditPage;
