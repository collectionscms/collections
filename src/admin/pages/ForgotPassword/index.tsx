import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import logger from '../../../utilities/logger';
import RouterLink from '../../components/elements/Link';
import { useAuth } from '../../components/utilities/Auth';
import ComposeWrapper from '../../components/utilities/ComposeWrapper';
import {
  forgotPasswordSchema,
  FormValues,
} from '../../fields/schemas/authentications/forgotPassword';
import { ForgotPasswordContextProvider, useForgotPassword } from './Context';

const ForgotPasswordPage: React.FC = () => {
  const { user } = useAuth();
  const { forgotPassword } = useForgotPassword();
  const { data: message, trigger, isMutating } = forgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '' },
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
    } catch (e) {
      logger.error(e);
    }
  };

  if (message) {
    return (
      <>
        <Stack justifyContent="center" alignItems="center">
          <h1>{t('email_sent')}</h1>
        </Stack>
        <p>{t('check_email_reset_password')}</p>
        <Button variant="outlined" size="large" component={RouterLink} to="/admin/auth/login">
          {t('back_to_login')}
        </Button>
      </>
    );
  }

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
        <h1>{t('forgot')}</h1>
      </Stack>
      <Stack component="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <InputLabel>{t('email')}</InputLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField name="email" {...field} type="text" error={errors.email !== undefined} />
            )}
          />
          <FormHelperText error>{errors.email?.message}</FormHelperText>
        </Stack>
        <Button variant="contained" type="submit" size="large" disabled={isMutating}>
          {t('submit')}
        </Button>
        <Box>
          <RouterLink to="/admin/auth/login">{t('back_to_login')}</RouterLink>
        </Box>
      </Stack>
    </>
  );
};

export default ComposeWrapper({ context: ForgotPasswordContextProvider })(ForgotPasswordPage);
