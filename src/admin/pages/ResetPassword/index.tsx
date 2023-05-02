import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { logger } from '../../../utilities/logger.js';
import { RouterLink } from '../../components/elements/Link/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  resetPassword as resetPasswordSchema,
} from '../../fields/schemas/authentications/resetPassword.js';
import { ResetPasswordContextProvider, useResetPassword } from './Context/index.js';

const ResetPasswordImpl: React.FC = () => {
  const { user } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { resetPassword } = useResetPassword();
  const { trigger, isMutating } = resetPassword();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { password: '', token: token },
    resolver: yupResolver(resetPasswordSchema(t)),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      navigate('../users');
    } catch (e) {
      logger.error(e);
    }
  };

  if (user) {
    return (
      <>
        <Stack justifyContent="center" alignItems="center">
          <h1>{t('already_logged_in')}</h1>
        </Stack>
        <Button variant="outlined" size="large" component={RouterLink} to="/admin/collections">
          {t('back_to_home')}
        </Button>
      </>
    );
  }

  return (
    <>
      <Stack justifyContent="center" alignItems="center">
        <h1>{t('reset_password')}</h1>
      </Stack>
      <Stack component="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name="token"
            control={control}
            render={({ field }) => <TextField {...field} type="hidden" sx={{ display: 'none' }} />}
          />
          <input type="hidden" {...register('token')} value={token} />
          <InputLabel>{t('new_password')}</InputLabel>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField {...field} type="password" error={errors.password !== undefined} />
            )}
          />
          <FormHelperText error>{errors.password?.message}</FormHelperText>
        </Stack>
        <Button variant="contained" type="submit" size="large" disabled={isMutating}>
          {t('save')}
        </Button>
      </Stack>
    </>
  );
};

export const ResetPassword = ComposeWrapper({ context: ResetPasswordContextProvider })(
  ResetPasswordImpl
);
