import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MainCard } from 'superfast-ui';
import { logger } from '../../../../utilities/logger.js';
import { RenderFields } from '../../../components/forms/RenderFields/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { ApiPreview } from '../ApiPreview/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';
import { Props } from './types.js';

const SingletonPageImpl: React.FC<Props> = ({ collection }) => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { getContents, getFields, createContent, updateContent } = useContent();

  const collectionId = collection.id.toString();
  const { data: metaFields } = getFields(collectionId);
  const { data: content } = getContents(collectionId);

  const { trigger: createTrigger, isMutating: isCreateMutating } = createContent(collectionId);
  const {
    trigger: updateTrigger,
    isMutating: isUpdateMutating,
    reset,
  } = updateContent(collection.collection, content?.id);

  const formContext = useForm({
    defaultValues: metaFields.reduce(
      (acc, field) => {
        if (content[field.field]) {
          acc[field.field] = content[field.field];
        } else if (field.fieldOption?.defaultValue) {
          acc[field.field] = field.fieldOption?.defaultValue;
        }

        return acc;
      },
      {} as Record<string, any>
    ),
  });

  const onSubmit = async (data: Record<string, any>) => {
    reset();

    try {
      if (content?.id) {
        await updateTrigger(data);
        enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      } else {
        await createTrigger(data);
        enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
      }
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Grid container spacing={2.5}>
      <Grid xs={12} lg={8}>
        <MainCard
          title={<></>}
          secondary={
            <ApiPreview collectionId={collection.id.toString()} singleton={collection.singleton} />
          }
        >
          <form onSubmit={formContext.handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Stack spacing={1}>
                  <RenderFields form={formContext} fields={metaFields} />
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={
                      !hasPermission(collection.collection, 'update') ||
                      isCreateMutating ||
                      isUpdateMutating
                    }
                  >
                    {t('update')}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export const SingletonPage = ComposeWrapper({ context: ContentContextProvider })(SingletonPageImpl);
