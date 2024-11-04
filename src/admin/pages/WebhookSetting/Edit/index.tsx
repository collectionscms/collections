import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { DeleteButton } from '../../../components/elements/DeleteButton/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateWebhookSettingValidator,
} from '../../../fields/validators/webhookSettings/updateWebhookSetting.validator.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { useWebhookSetting, WebhookContextProvider } from '../Context/index.js';
import { CustomForm } from '../forms/Custom/index.js';
import { VercelForm } from '../forms/Vercel/index.js';

const EditWebhookSettingPageImpl: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { getWebhookSetting, updateWebhookSetting } = useWebhookSetting();
  const { data: webhookSetting } = getWebhookSetting(id);
  const { trigger, isMutating } = updateWebhookSetting(id);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: webhookSetting.name,
      enabled: webhookSetting.enabled,
      url: webhookSetting.url,
      onPublish: webhookSetting.onPublish,
      onArchive: webhookSetting.onArchive,
      onDeletePublished: webhookSetting.onDeletePublished,
      onRestorePublished: webhookSetting.onRestorePublished,
      onRevert: webhookSetting.onRevert,
    },
    resolver: yupResolver(updateWebhookSettingValidator(t)),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const providers = [
    {
      id: 'vercel',
      value: 'vercel',
      label: t('providers.vercel'),
      icon: <Icon name="Webhook" size={18} />,
    },
    {
      id: 'custom',
      value: 'custom',
      label: t('providers.custom'),
      icon: <Icon name="Webhook" size={18} />,
    },
  ];
  const provider = providers.filter((item) => item.value === webhookSetting.provider)[0];

  const notificationTriggers: {
    value: 'onPublish' | 'onArchive' | 'onDeletePublished' | 'onRestorePublished' | 'onRevert';
    label: string;
  }[] = [
    {
      value: 'onPublish',
      label: t('providers_field.on_publish'),
    },
    {
      value: 'onArchive',
      label: t('providers_field.on_archive'),
    },
    {
      value: 'onDeletePublished',
      label: t('providers_field.on_delete_published'),
    },
    {
      value: 'onRestorePublished',
      label: t('providers_field.on_restore_published'),
    },
    {
      value: 'onRevert',
      label: t('providers_field.on_revert'),
    },
  ];

  const navigateToList = () => {
    navigate('../webhooks');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
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
                {/* Provider */}
                <Grid xs={12}>
                  <Grid container spacing={1} sx={{ ml: 0 }}>
                    <Grid>
                      <MainCard
                        content={false}
                        sx={{
                          bgcolor: 'primary.lighter',
                          p: 1,
                        }}
                        border={false}
                        boxShadow={false}
                        shadow={theme.customShadows.primary}
                      >
                        <Stack gap={1} flexDirection="row" alignItems="center" sx={{ p: 1 }}>
                          {provider.icon}
                          <Typography variant="subtitle1" color="textSecondary">
                            {provider.label}
                          </Typography>
                        </Stack>
                      </MainCard>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Name */}
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

                {/* Form */}
                {webhookSetting.provider === 'vercel' && (
                  <VercelForm control={control} errors={errors} />
                )}
                {webhookSetting.provider === 'custom' && (
                  <CustomForm control={control} errors={errors} />
                )}

                {/* Trigger */}
                <Grid xs={12}>
                  <InputLabel sx={{ mb: 2 }}>{t('notification_triggers')}</InputLabel>
                  <Grid container spacing={2}>
                    <Stack>
                      {notificationTriggers.map((item) => (
                        <Controller
                          name={item.value}
                          key={item.value}
                          control={control}
                          render={({ field }) => (
                            <>
                              <Grid sx={{ py: 0.5 }}>
                                <FormControlLabel
                                  {...field}
                                  value={field.value}
                                  control={<Checkbox checked={watch(item.value)} {...field} />}
                                  label={item.label}
                                />
                              </Grid>
                            </>
                          )}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>

                {/* Enabled */}
                <Grid xs={12}>
                  <InputLabel sx={{ mb: 2 }}>{t('status')}</InputLabel>
                  <Grid container spacing={2}>
                    <Stack>
                      <Controller
                        name="enabled"
                        control={control}
                        render={({ field }) => (
                          <Grid sx={{ py: 0.5 }}>
                            <FormControlLabel
                              control={<Switch checked={field.value} {...field} />}
                              label={t('enabled')}
                            />
                          </Grid>
                        )}
                      />
                    </Stack>
                  </Grid>
                </Grid>

                <Grid xs={12}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: 1 }}
                  >
                    {hasPermission('deleteWebhookSetting') ? (
                      <DeleteButton id={id} slug="webhook-settings" onSuccess={navigateToList} />
                    ) : (
                      <div />
                    )}
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" color="secondary" onClick={navigateToList}>
                        {t('cancel')}
                      </Button>
                      <Button variant="contained" type="submit" disabled={isMutating}>
                        {t('save')}
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

export const EditWebhookSettingPage = ComposeWrapper({ context: WebhookContextProvider })(
  EditWebhookSettingPageImpl
);
