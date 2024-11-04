import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import { apiKeyActions } from '../../../../api/persistence/permission/permission.entity.js';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { DeleteButton } from '../../../components/elements/DeleteButton/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateApiKeyValidator,
} from '../../../fields/validators/apiKeys/updateApiKey.validator.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { ApiKeyContextProvider, useApiKey } from '../Context/index.js';

const EditApiKeyPageImpl: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getApiKey, updateApiKey } = useApiKey();
  const { data: apiKey } = getApiKey(id);
  const { trigger: updateTrigger, isMutating: isUpdateMutating } = updateApiKey(id);

  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: apiKey.name,
      key: '',
      permissions: apiKey.permissions,
    },
    resolver: yupResolver(updateApiKeyValidator()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const navigateToList = () => {
    navigate('../api-keys');
  };

  const handleGenerateApiKey = () => {
    setValue('key', v4());
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await updateTrigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      navigateToList();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5}>
        <Grid xs={12} md={10}>
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
                <Grid xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>{t('api_key')}</InputLabel>
                    <Controller
                      name="key"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          placeholder={t('hidden_for_security')}
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title={t('generate_api_key')} placement="top">
                                  <IconButton
                                    edge="end"
                                    color="secondary"
                                    onClick={handleGenerateApiKey}
                                  >
                                    <Icon name="RefreshCw" size={16} />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          error={errors.key !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.key?.message}</FormHelperText>
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
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: 1 }}
                  >
                    {hasPermission('deleteApiKey') ? (
                      <DeleteButton id={id} slug="api-keys" onSuccess={navigateToList} />
                    ) : (
                      <div />
                    )}
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" color="secondary" onClick={navigateToList}>
                        {t('cancel')}
                      </Button>
                      <Button variant="contained" type="submit" disabled={isUpdateMutating}>
                        {t('update')}
                      </Button>
                    </Stack>
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

export const EditApiKeyPage = ComposeWrapper({ context: ApiKeyContextProvider })(
  EditApiKeyPageImpl
);
