import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
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
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  inviteUser as createUserSchema,
} from '../../../fields/validators/users/createUser.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { UserContextProvider, useUser } from '../Context/index.js';

const CreateUserPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { inviteUser, getRoles } = useUser();
  const { trigger, isMutating } = inviteUser();
  const { data: roles } = getRoles();
  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      roleId: roles ? roles[0]?.id.toString() : '',
    },
    resolver: yupResolver(createUserSchema(t)),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const navigateToList = () => {
    navigate('../users');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
      enqueueSnackbar(t('toast.invited_successfully'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      navigate('../users');
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('email')}</InputLabel>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.email !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.email?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('role')}</InputLabel>
                    <Controller
                      name="roleId"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} fullWidth>
                          {roles &&
                            roles.map((role) => (
                              <MenuItem value={role.id} key={role.id}>
                                {role.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button variant="outlined" color="secondary" onClick={navigateToList}>
                      {t('cancel')}
                    </Button>
                    <Button variant="contained" type="submit" disabled={isMutating}>
                      {t('invite')}
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

export const CreateUserPage = ComposeWrapper({ context: UserContextProvider })(CreateUserPageImpl);
