import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  createWebhookSettingValidator,
  FormValues,
} from '../../../fields/validators/webhookSettings/createWebhookSetting.validator.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { useWebhookSetting, WebhookContextProvider } from '../Context/index.js';
import { CustomForm } from '../forms/Custom/index.js';
import { VercelForm } from '../forms/Vercel/index.js';

const CreateWebhookSettingPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createWebhookSetting } = useWebhookSetting();
  const { trigger, isMutating } = createWebhookSetting();

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      provider: 'vercel',
      url: '',
      onPublish: true,
      onArchive: true,
      onDeletePublished: true,
      onRestorePublished: true,
      onRevert: true,
    },
    resolver: yupResolver(createWebhookSettingValidator(t)),
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
      enqueueSnackbar(t('toast.created_successfully'), {
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
                  <Controller
                    name="provider"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row value={field.value}>
                        <Grid container spacing={1.75} sx={{ ml: 1 }}>
                          {providers.map((item, index) => (
                            <Grid key={index}>
                              <FormControlLabel
                                {...field}
                                value={item.value}
                                control={<Radio value={item.value} sx={{ display: 'none' }} />}
                                sx={{
                                  display: 'flex',
                                  '& .MuiFormControlLabel-label': { flex: 1 },
                                }}
                                label={
                                  <MainCard
                                    content={false}
                                    sx={{
                                      bgcolor:
                                        field.value === item.value
                                          ? 'primary.lighter'
                                          : 'secondary.lighter',
                                      p: 1,
                                    }}
                                    border={false}
                                    {...(field.value === item.value && {
                                      boxShadow: true,
                                      shadow: theme.customShadows.primary,
                                    })}
                                  >
                                    <Stack
                                      gap={1}
                                      flexDirection="row"
                                      alignItems="center"
                                      sx={{ p: 1 }}
                                    >
                                      {item.icon}
                                      <Typography variant="subtitle1" color="textSecondary">
                                        {item.label}
                                      </Typography>
                                    </Stack>
                                  </MainCard>
                                }
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                    )}
                  />
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
                {watch('provider') === 'vercel' && <VercelForm control={control} errors={errors} />}
                {watch('provider') === 'custom' && <CustomForm control={control} errors={errors} />}

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

export const CreateWebhookSettingPage = ComposeWrapper({ context: WebhookContextProvider })(
  CreateWebhookSettingPageImpl
);
