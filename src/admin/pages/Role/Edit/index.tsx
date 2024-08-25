import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { roleActions } from '../../../../api/persistence/permission/permission.entity.js';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { DeleteButton } from '../../../components/elements/DeleteButton/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateRole as updateRoleSchema,
} from '../../../fields/validators/roles/updateRole.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { RoleContextProvider, useRole } from '../Context/index.js';

const EditRolePageImpl: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getRole, updateRole } = useRole();
  const { data: role } = getRole(id);
  const { trigger: updateRoleTrigger, isMutating: isUpdateRoleMutating } = updateRole(id);
  const {
    watch,
    reset,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    },
    resolver: yupResolver(updateRoleSchema()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);
  const formPermissions = [
    { label: t('post_permission'), permissions: roleActions.post },
    { label: t('review_permission'), permissions: roleActions.review },
    { label: t('invitation_permission'), permissions: roleActions.invitation },
    { label: t('project_permission'), permissions: roleActions.project },
    { label: t('user_permission'), permissions: roleActions.user },
    { label: t('role_permission'), permissions: roleActions.role },
    { label: t('api_key_permission'), permissions: roleActions.apiKey },
  ];

  const navigateToList = () => {
    navigate('../roles');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await updateRoleTrigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      navigate('../roles');
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
                      <FormHelperText error>{errors.permissions?.message}</FormHelperText>
                    </Grid>
                  );
                })}

                <Grid xs={12}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: 1 }}
                  >
                    {hasPermission('deleteRole') ? (
                      <DeleteButton id={id} slug="roles" onSuccess={navigateToList} />
                    ) : (
                      <div />
                    )}
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" color="secondary" onClick={navigateToList}>
                        {t('cancel')}
                      </Button>
                      <Button variant="contained" type="submit" disabled={isUpdateRoleMutating}>
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

export const EditRolePage = ComposeWrapper({ context: RoleContextProvider })(EditRolePageImpl);
