import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainCard } from '@collectionscms/plugin-ui';
import { logger } from '../../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { RenderFields } from '../../../components/forms/RenderFields/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { getModelId } from '../../../utilities/getModelId.js';
import { ContentContextProvider, useContent } from '../Context/index.js';

const CreateModelPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { getFields, createContent } = useContent();

  const modelId = getModelId(useLocation().pathname);
  const { data: metaFields } = getFields(modelId);
  const { trigger: createTrigger, isMutating: isCreateMutating } = createContent(modelId);

  const formContext = useForm({
    defaultValues: metaFields.reduce(
      (acc, field) => {
        if (field.fieldOption?.defaultValue !== undefined) {
          acc[field.field] = field.fieldOption?.defaultValue;
        }

        return acc;
      },
      {} as Record<string, any>
    ),
  });

  const {
    reset,
    formState: { isDirty },
  } = formContext;
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const navigateToList = () => {
    navigate(`/admin/models/${modelId}/contents`);
  };

  const hasSavePermission = hasPermission(modelId, 'create');

  const onSubmit = async (data: Record<string, any>) => {
    try {
      reset(data);
      await createTrigger(data);
      enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
      navigate(`/admin/models/${modelId}/contents`);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
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
    </>
  );
};

export const CreateModelPage = ComposeWrapper({ context: ContentContextProvider })(
  CreateModelPageImpl
);
