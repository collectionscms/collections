import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiKeyActions } from '../../../../api/persistence/permission/permission.entity.js';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { createApiKeySchema, FormValues } from '../../../fields/validators/apiKeys/createApiKey.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { ApiKeyContextProvider, useApiKey } from '../Context/index.js';

const CreateApiKeyPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createApiKey } = useApiKey();
  const { trigger, isMutating } = createApiKey();

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      permissions: [],
    },
    resolver: yupResolver(createApiKeySchema()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const navigateToList = () => {
    navigate('../api-keys');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
      enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
      navigateToList();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('name')}</InputLabel>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.name !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.name?.message}</FormHelperText>
                  </Stack>
                </Grid>

                {/* Permissions */}
                <Grid xs={12}>
                  <InputLabel sx={{ mb: 2 }}>{t('post_permission')}</InputLabel>
                  <Grid container spacing={2}>
                    <Controller
                      name="permissions"
                      control={control}
                      render={({ field }) => (
                        <>
                          {Object.values(apiKeyActions.post).map((permission) => {
                            return (
                              <Grid xs={6} sm={4} sx={{ py: 0.5 }} key={permission}>
                                <Stack>
                                  <FormControlLabel
                                    {...field}
                                    value={permission}
                                    control={
                                      <Checkbox
                                        {...field}
                                        checked={watch('permissions').includes(permission)}
                                        onChange={() => {
                                          if (!field.value.includes(permission)) {
                                            field.onChange([...field.value, permission]);
                                            return;
                                          }
                                          const newTopics = field.value.filter(
                                            (topic) => topic !== permission
                                          );
                                          field.onChange(newTopics);
                                        }}
                                      />
                                    }
                                    label={t(
                                      `permissions.action.${permission}` as unknown as TemplateStringsArray
                                    )}
                                  />
                                </Stack>
                              </Grid>
                            );
                          })}
                        </>
                      )}
                    />
                  </Grid>
                  <FormHelperText error>{errors.permissions?.message}</FormHelperText>
                </Grid>

                <Grid xs={12}>
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button variant="outlined" color="secondary" onClick={navigateToList}>
                      {t('cancel')}
                    </Button>
                    <Button variant="contained" type="submit" disabled={isMutating}>
                      {t('save')}
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

export const CreateApiKeyPage = ComposeWrapper({ context: ApiKeyContextProvider })(
  CreateApiKeyPageImpl
);
