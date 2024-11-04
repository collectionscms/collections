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
import { roleActions } from '../../../../api/persistence/permission/permission.entity.js';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  createRoleValidator as createRoleSchema,
} from '../../../fields/validators/roles/createRole.validator.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { RoleContextProvider, useRole } from '../Context/index.js';

const CreateRolePageImpl: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createRole } = useRole();
  const { trigger, isMutating } = createRole();
  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
    resolver: yupResolver(createRoleSchema()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);
  const formPermissions = [
    { label: t('post_permission'), permissions: roleActions.post },
    { label: t('review_permission'), permissions: roleActions.review },
    { label: t('project_permission'), permissions: roleActions.project },
    { label: t('user_permission'), permissions: roleActions.user },
    { label: t('role_permission'), permissions: roleActions.role },
    { label: t('api_key_permission'), permissions: roleActions.apiKey },
    { label: t('webhook_permission'), permissions: roleActions.webhookSetting },
  ];
  const navigateToList = () => {
    navigate('../roles');
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
      navigate(`../roles`);
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
                    <InputLabel>{t('description')}</InputLabel>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.description !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.description?.message}</FormHelperText>
                  </Stack>
                </Grid>

                {/* Permissions */}
                {formPermissions.map((formPermission) => {
                  return (
                    <Grid xs={12} key={formPermission.label}>
                      <InputLabel sx={{ mb: 2 }}>{formPermission.label}</InputLabel>
                      <Grid container spacing={2}>
                        <Controller
                          name="permissions"
                          control={control}
                          render={({ field }) => (
                            <>
                              {Object.values(formPermission.permissions).map((permission) => {
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
                    </Grid>
                  );
                })}
                <Grid xs={12}>
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

export const CreateRolePage = ComposeWrapper({ context: RoleContextProvider })(CreateRolePageImpl);
