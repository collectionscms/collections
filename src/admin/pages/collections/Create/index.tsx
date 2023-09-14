import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MainCard } from 'superfast-ui';
import { logger } from '../../../../utilities/logger.js';
import { RenderFields } from '../../../components/forms/RenderFields/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { Props } from './types.js';

const CreateCollectionPageImpl: React.FC<Props> = ({ collection }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { getFields, createContent } = useContent();

  const collectionId = collection.id.toString();
  const { data: metaFields } = getFields(collectionId);
  const { trigger: createTrigger, isMutating: isCreateMutating } = createContent(collectionId);

  const formContext = useForm({
    defaultValues: metaFields.reduce(
      (acc, field) => {
        if (field.fieldOption?.defaultValue) {
          acc[field.field] = field.fieldOption?.defaultValue;
        }

        return acc;
      },
      {} as Record<string, any>
    ),
  });

  const navigateToList = () => {
    navigate(`/admin/collections/${collection.collection}`);
  };

  const hasSavePermission = hasPermission(collection.collection, 'create');

  const onSubmit = async (data: Record<string, any>) => {
    try {
      await createTrigger(data);
      enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
      navigate(`/admin/collections/${collection.collection}`);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Grid container spacing={2.5}>
      <Grid xs={12} lg={8}>
        <MainCard>
          <form onSubmit={formContext.handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Stack spacing={1}>
                  <RenderFields form={formContext} fields={metaFields} />
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Grid xs={12}>
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button variant="outlined" color="secondary" onClick={navigateToList}>
                      {t('cancel')}
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!hasSavePermission || isCreateMutating}
                    >
                      {t('save')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export const CreateCollectionPage = ComposeWrapper({ context: ContentContextProvider })(
  CreateCollectionPageImpl
);
