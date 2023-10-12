import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { MainCard } from '@collectionscms/plugin-ui';
import { logger } from '../../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { RenderFields } from '../../../components/forms/RenderFields/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { getModelId } from '../../../utilities/getModelId.js';
import { ApiPreview } from '../ApiPreview/index.js';
import { ContentContextProvider, useContent } from '../Context/index.js';

const SingletonPageImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { getContents, getFields, createContent, updateContent } = useContent();

  const modelId = getModelId(useLocation().pathname);
  const { data: metaFields } = getFields(modelId);
  const { data: content, mutate } = getContents(modelId);

  const { trigger: createTrigger, isMutating: isCreateMutating } = createContent(modelId);
  const {
    trigger: updateTrigger,
    isMutating: isUpdateMutating,
    reset,
  } = updateContent(modelId, content?.id);

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

  const {
    reset: resetForm,
    formState: { isDirty },
  } = formContext;
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const onSubmit = async (data: Record<string, any>) => {
    try {
      reset();
      resetForm(data);

      if (content?.id) {
        await updateTrigger(data);
        enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      } else {
        await createTrigger(data);
        enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
      }

      mutate(data);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard title={<></>} secondary={<ApiPreview modelId={modelId} singleton={true} />}>
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
                        !hasPermission(modelId, 'update') || isCreateMutating || isUpdateMutating
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
    </>
  );
};

export const SingletonPage = ComposeWrapper({ context: ContentContextProvider })(SingletonPageImpl);
